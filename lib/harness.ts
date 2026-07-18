export type HarnessAsset = {
  fileName: string;
  label: string;
  mediaType: string;
  content: string;
};

function requireMachineApiUrl(value: string | undefined): string {
  const url = value?.trim();
  if (!url) {
    throw new Error("NEXT_PUBLIC_MACHINE_API_URL is required to generate the agent harness.");
  }
  return url;
}

function skill(machineApiUrl: string): string {
  return `# Langler lesson authoring

Use Langler's reference API before writing a lesson. The API base URL is ${machineApiUrl}. Authenticate every call with \`Authorization: Bearer $LANGLER_TOKEN\`.

## Workflow

1. Ask for the learner's language, level, topic, interests, and readiness if they are not already clear.
2. Query \`/reference/vocab\` and \`/reference/grammar\` for that language and level. Query \`/reference/scripts\` when script practice is relevant. Follow \`nextCursor\` when needed. Keep the returned IDs with the material you select.
3. Compose one schema-version 1.0 lesson grounded in the retrieved material. Put each used ID in the exercise's \`referencedVocab\` or \`referencedGrammar\` array. Never invent a reference ID.
4. Default \`readingStage\` to \`connected\`. A connected lesson must culminate in a level-appropriate reading exercise whose \`payload.genre\` is \`short_story\`, with a concrete title, a grounded narrative passage using the target material, and comprehension questions with answers. A vocabulary list or disconnected example sentences are not a story.
5. Use \`readingStage: foundational\` only when the user's stated readiness makes connected reading impractical. In that explicit exception, focus on decoding, script, and short sentences; explain that connected reading begins in a later lesson. Do not add a token short story merely to satisfy the connected contract.
6. Give every lesson a fresh UUID and every exercise a unique ID. Keep language and level consistent. Include useful points and an estimated duration.
7. Import with \`POST /lessons/import\`, \`Content-Type: application/json\`, and a stable, unique \`Idempotency-Key\`. Reuse the same key when retrying the same request. A 200 response means Langler returned the original import; 201 means it created the lesson.
8. If validation returns \`issues\`, correct every cited JSON path. Re-query reference data for any missing IDs. Retry with the same idempotency key only when the intended lesson is unchanged; use a new key after changing the lesson.

## Quality bar

- Match vocabulary, grammar, passage length, and question difficulty to the requested level.
- Ground the story in the selected topic and retrieved targets; use those targets naturally rather than listing them.
- Include at least two comprehension questions for connected lessons when the learner can reasonably answer them.
- Do not call any server-side model endpoint. You are the author; Langler validates, stores, plays, and prints.

See \`langler-openapi.yaml\` for the exact API and lesson schema.`;
}

function openapi(machineApiUrl: string): string {
  return `openapi: 3.1.0
info:
  title: Langler Agent Authoring API
  version: 1.0.0
  description: Query grounded language reference data and import validated lessons.
servers:
  - url: ${machineApiUrl}
security:
  - machineToken: []
paths:
  /reference/vocab:
    get:
      operationId: listVocabulary
      summary: Retrieve vocabulary by language, level, and topic.
      parameters:
        - $ref: '#/components/parameters/Language'
        - $ref: '#/components/parameters/Level'
        - name: topic
          in: query
          schema: { type: string }
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/Cursor'
      responses:
        '200':
          description: A page of grounded vocabulary.
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ReferencePage' }
  /reference/grammar:
    get:
      operationId: listGrammar
      summary: Retrieve grammar by language and level.
      parameters:
        - $ref: '#/components/parameters/Language'
        - $ref: '#/components/parameters/Level'
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/Cursor'
      responses:
        '200':
          description: A page of grounded grammar.
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ReferencePage' }
  /reference/scripts:
    get:
      operationId: listScripts
      summary: Retrieve script glyphs for foundational practice.
      parameters:
        - $ref: '#/components/parameters/Language'
        - name: type
          in: query
          schema: { type: string, enum: [kana, kanji, alphabet, abugida] }
        - $ref: '#/components/parameters/Level'
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/Cursor'
      responses:
        '200':
          description: A page of script glyphs.
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ReferencePage' }
  /lessons/import:
    post:
      operationId: importLesson
      summary: Validate and idempotently import a lesson into the token owner's library.
      parameters:
        - name: Idempotency-Key
          in: header
          required: true
          schema: { type: string, minLength: 8, maxLength: 200 }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/Lesson' }
      responses:
        '201': { description: Lesson created }
        '200': { description: Original lesson returned for a duplicate key }
        '400':
          description: Validation failed with path-specific issues.
        '409': { description: Idempotency key was already used with different content }
components:
  securitySchemes:
    machineToken:
      type: http
      scheme: bearer
      bearerFormat: lang_sk
  parameters:
    Language:
      name: lang
      in: query
      required: true
      schema: { type: string, enum: [ja, my, pl] }
    Level:
      name: level
      in: query
      schema: { type: string }
    Limit:
      name: limit
      in: query
      schema: { type: integer, minimum: 1, maximum: 200 }
    Cursor:
      name: cursor
      in: query
      schema: { type: string }
  schemas:
    ReferencePage:
      type: object
      required: [items]
      properties:
        items: { type: array, items: { type: object } }
        nextCursor: { type: string }
    Lesson:
      type: object
      additionalProperties: false
      required: [schemaVersion, lessonId, language, level, title, readingStage, exercises]
      properties:
        schemaVersion: { const: '1.0' }
        lessonId: { type: string, format: uuid }
        language: { type: string, enum: [ja, my, pl] }
        level: { type: string }
        title: { type: string, minLength: 1, maxLength: 160 }
        description: { type: string, maxLength: 1000 }
        topic: { type: string, maxLength: 120 }
        tags: { type: array, maxItems: 10, items: { type: string, maxLength: 40 } }
        readingStage: { type: string, enum: [connected, foundational], default: connected }
        sourceModel: { type: string, maxLength: 80 }
        estimatedMinutes: { type: integer, minimum: 0, maximum: 240 }
        exercises:
          type: array
          minItems: 1
          maxItems: 25
          items: { $ref: '#/components/schemas/Exercise' }
    Exercise:
      type: object
      additionalProperties: false
      required: [exerciseId, type, payload]
      properties:
        exerciseId: { type: string, minLength: 1 }
        type: { type: string, enum: [cloze, translation, ordering, matching, reading, writing_prompt, script_practice] }
        prompt: { type: string }
        points: { type: integer, minimum: 0 }
        referencedVocab: { type: array, items: { type: string } }
        referencedGrammar: { type: array, items: { type: string } }
        payload:
          oneOf:
            - $ref: '#/components/schemas/ClozePayload'
            - $ref: '#/components/schemas/TranslationPayload'
            - $ref: '#/components/schemas/OrderingPayload'
            - $ref: '#/components/schemas/MatchingPayload'
            - $ref: '#/components/schemas/ReadingPayload'
            - $ref: '#/components/schemas/WritingPayload'
            - $ref: '#/components/schemas/ScriptPayload'
    ClozePayload:
      type: object
      additionalProperties: false
      required: [text, blanks]
      properties:
        text: { type: string, description: 'Use {{1}}, {{2}}, and so on for blank markers.' }
        blanks:
          type: array
          items:
            type: object
            additionalProperties: false
            required: [index, answer]
            properties:
              index: { type: integer, minimum: 1 }
              answer: { type: string }
              alternates: { type: array, items: { type: string } }
              hint: { type: string }
    TranslationPayload:
      type: object
      additionalProperties: false
      required: [source]
      properties:
        source: { type: string }
        reference: { type: string }
    OrderingPayload:
      type: object
      additionalProperties: false
      required: [items]
      properties:
        items: { type: array, minItems: 2, maxItems: 20, items: { type: string } }
        translation: { type: string }
    MatchingPayload:
      type: object
      additionalProperties: false
      required: [pairs]
      properties:
        pairs:
          type: array
          minItems: 2
          maxItems: 20
          items:
            type: object
            additionalProperties: false
            required: [left, right]
            properties:
              left: { type: string }
              right: { type: string }
    ReadingPayload:
      type: object
      additionalProperties: false
      required: [genre, title, passage, questions]
      properties:
        genre: { const: short_story }
        title: { type: string }
        passage: { type: string }
        annotations:
          type: array
          items:
            type: object
            additionalProperties: false
            required: [surface]
            properties:
              surface: { type: string }
              reading: { type: string }
              gloss: { type: string }
        questions:
          type: array
          minItems: 1
          items:
            type: object
            additionalProperties: false
            required: [question, kind]
            properties:
              question: { type: string }
              kind: { type: string, enum: [multiple_choice, short_answer] }
              options: { type: array, items: { type: string } }
              answer: { type: string }
    WritingPayload:
      type: object
      additionalProperties: false
      properties:
        guidance: { type: string }
        modelAnswer: { type: string }
    ScriptPayload:
      type: object
      additionalProperties: false
      required: [items]
      properties:
        items:
          type: array
          minItems: 1
          items:
            type: object
            additionalProperties: false
            required: [glyph]
            properties:
              glyph: { type: string }
              reading: { type: string }
              meaning: { type: string }
`;
}

const mcpServer = `#!/usr/bin/env node
const baseUrl = process.env.LANGLER_API_URL;
const token = process.env.LANGLER_TOKEN;
if (!baseUrl || !token) process.exit(1);
const tools = [
  {name:'query_vocab',description:'Retrieve grounded vocabulary before composing a Langler lesson.',inputSchema:{type:'object',required:['lang'],properties:{lang:{type:'string'},level:{type:'string'},topic:{type:'string'},limit:{type:'integer'},cursor:{type:'string'}}}},
  {name:'query_grammar',description:'Retrieve grounded grammar before composing a Langler lesson.',inputSchema:{type:'object',required:['lang'],properties:{lang:{type:'string'},level:{type:'string'},limit:{type:'integer'},cursor:{type:'string'}}}},
  {name:'query_scripts',description:'Retrieve script glyphs for an explicitly foundational lesson.',inputSchema:{type:'object',required:['lang'],properties:{lang:{type:'string'},type:{type:'string'},level:{type:'string'},limit:{type:'integer'},cursor:{type:'string'}}}},
  {name:'import_lesson',description:'Validate and idempotently import a complete lesson into the token owner library.',inputSchema:{type:'object',required:['idempotencyKey','lesson'],properties:{idempotencyKey:{type:'string',minLength:8},lesson:{type:'object'}}}}
];
async function call(name,args){
  const paths={query_vocab:'/reference/vocab',query_grammar:'/reference/grammar',query_scripts:'/reference/scripts'};
  let path=paths[name],options={headers:{Authorization:'Bearer '+token}};
  if(path){const query=new URLSearchParams(Object.entries(args).filter(([,v])=>v!==undefined).map(([k,v])=>[k,String(v)]));path+='?'+query;}
  else if(name==='import_lesson'){path='/lessons/import';options={method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json','Idempotency-Key':args.idempotencyKey},body:JSON.stringify(args.lesson)};}
  else throw new Error('unknown tool');
  const response=await fetch(baseUrl+path,options),text=await response.text();
  if(!response.ok) throw new Error('Langler '+response.status+': '+text);
  return {content:[{type:'text',text}]};
}
function send(message){process.stdout.write(JSON.stringify(message)+'\\n');}
let buffer='';
process.stdin.setEncoding('utf8');
process.stdin.on('data',chunk=>{buffer+=chunk;let lines=buffer.split('\\n');buffer=lines.pop();for(const line of lines){if(!line.trim())continue;(async()=>{let request;try{request=JSON.parse(line);if(request.id===undefined)return;let result;if(request.method==='initialize')result={protocolVersion:'2025-06-18',capabilities:{tools:{}},serverInfo:{name:'langler',version:'1.0.0'}};else if(request.method==='tools/list')result={tools};else if(request.method==='tools/call')result=await call(request.params.name,request.params.arguments||{});else if(request.method==='ping')result={};else throw new Error('method not found');send({jsonrpc:'2.0',id:request.id,result});}catch(error){const message=error instanceof Error?error.message:'request failed';if(request?.method==='tools/call'&&request.id!==undefined)send({jsonrpc:'2.0',id:request.id,result:{content:[{type:'text',text:message}],isError:true}});else send({jsonrpc:'2.0',id:request?.id??0,error:{code:-32000,message}});}})();}});
`;

function mcpConfig(machineApiUrl: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        langler: {
          command: "node",
          args: ["/absolute/path/to/langler-mcp.mjs"],
          env: {
            LANGLER_API_URL: machineApiUrl,
          },
        },
      },
    },
    null,
    2,
  );
}

export function harnessAssets(machineApiUrl: string | undefined): HarnessAsset[] {
  const url = requireMachineApiUrl(machineApiUrl);
  return [
    { fileName: "SKILL.md", label: "Skill", mediaType: "text/markdown", content: skill(url) },
    { fileName: "langler-openapi.yaml", label: "OpenAPI", mediaType: "application/yaml", content: openapi(url) },
    { fileName: "langler-mcp.mjs", label: "MCP server", mediaType: "text/javascript", content: mcpServer },
    { fileName: "mcp.json", label: "MCP config", mediaType: "application/json", content: mcpConfig(url) },
  ];
}
