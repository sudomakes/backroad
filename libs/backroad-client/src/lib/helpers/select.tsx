import { SelectOptionType } from 'backroad-core';
import type { GroupBase } from 'react-select';

type OptionsType = SelectOptionType | GroupBase<SelectOptionType>;
export const isGroupedOptions = (
  optionEntry: OptionsType
): optionEntry is GroupBase<SelectOptionType> => {
  return 'options' in optionEntry;
};

export const getFlattenedOptions = (
  optionEntries: readonly OptionsType[] | undefined
): readonly SelectOptionType[] => {
  return (
    optionEntries?.flatMap((optionEntry) =>
      isGroupedOptions(optionEntry) ? optionEntry.options : [optionEntry]
    ) || []
  );
};
