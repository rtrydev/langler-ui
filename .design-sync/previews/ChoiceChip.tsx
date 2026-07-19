import { ChoiceChip } from "langler-ui";

export const LevelRadio = () => (
  <div className="flex flex-wrap gap-2">
    <ChoiceChip name="jlpt-level" value="n5">
      N5
    </ChoiceChip>
    <ChoiceChip defaultChecked name="jlpt-level" value="n4">
      N4
    </ChoiceChip>
    <ChoiceChip name="jlpt-level" value="n3">
      N3
    </ChoiceChip>
    <ChoiceChip name="jlpt-level" value="n2">
      N2
    </ChoiceChip>
    <ChoiceChip name="jlpt-level" value="n1">
      N1
    </ChoiceChip>
  </div>
);

export const ExerciseTypes = () => (
  <div className="flex flex-wrap gap-2">
    <ChoiceChip defaultChecked name="exercise-types" type="checkbox" value="multiple-choice">
      Multiple choice
    </ChoiceChip>
    <ChoiceChip defaultChecked name="exercise-types" type="checkbox" value="cloze">
      Cloze
    </ChoiceChip>
    <ChoiceChip name="exercise-types" type="checkbox" value="word-order">
      Word order
    </ChoiceChip>
    <ChoiceChip name="exercise-types" type="checkbox" value="translation">
      Translation
    </ChoiceChip>
  </div>
);

export const Disabled = () => (
  <div className="flex flex-wrap gap-2">
    <ChoiceChip disabled name="scopes" type="checkbox" value="read-reference">
      Read reference
    </ChoiceChip>
    <ChoiceChip defaultChecked disabled name="scopes" type="checkbox" value="import-lessons">
      Import lessons
    </ChoiceChip>
  </div>
);
