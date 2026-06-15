import { SelectOptionType } from '@backroad/core';
import type { ClassNamesConfig, GroupBase } from 'react-select';
import { cn } from 'backroad-ui';

type OptionsType = SelectOptionType | GroupBase<SelectOptionType>;

/**
 * Token-driven classNames for react-select used in `unstyled` mode. This is
 * how the searchable single/multi selects pick up the shadcn theme tokens
 * (and flip with light/dark + the tweakcn palettes) now that daisyUI is gone.
 */
export const reactSelectClassNames: ClassNamesConfig<
  SelectOptionType,
  boolean,
  GroupBase<SelectOptionType>
> = {
  control: ({ isFocused }) =>
    cn(
      'flex min-h-9 w-full rounded-md border bg-transparent text-sm shadow-xs transition-[color,box-shadow]',
      isFocused ? 'border-ring ring-[3px] ring-ring/50' : 'border-input'
    ),
  valueContainer: () => 'flex flex-wrap items-center gap-1 px-2 py-1',
  placeholder: () => 'text-muted-foreground',
  input: () => 'text-foreground',
  singleValue: () => 'text-foreground',
  multiValue: () =>
    'items-center gap-1 rounded-sm bg-secondary pl-2 pr-1 text-secondary-foreground',
  multiValueLabel: () => 'py-0.5 text-sm text-secondary-foreground',
  multiValueRemove: () =>
    'rounded-sm px-0.5 hover:bg-destructive hover:text-destructive-foreground',
  indicatorsContainer: () => 'gap-1',
  dropdownIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
  clearIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
  indicatorSeparator: () => 'bg-border',
  menu: () =>
    'z-50 mt-1 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
  menuList: () => 'p-1',
  option: ({ isFocused, isSelected }) =>
    cn(
      'cursor-default rounded-sm px-2 py-1.5 text-sm',
      isFocused && 'bg-accent text-accent-foreground',
      isSelected && 'bg-primary text-primary-foreground'
    ),
  noOptionsMessage: () => 'p-2 text-sm text-muted-foreground',
  groupHeading: () => 'px-2 py-1.5 text-xs text-muted-foreground',
};
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
