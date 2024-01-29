import { getValue } from './get_value';
import { runScript } from './run_script';
import { setValue } from './set_value';
import { unsetValue } from './unset_value';

export const socketEventHandlers = {
  getValue,
  runScript,
  setValue,
  unsetValue,
};
