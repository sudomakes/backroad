import { Info, Monitor, Moon, Settings, Sun } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from 'backroad-ui';
import { useTheme } from '../../theme/theme-provider';
import { THEMES, type ThemeMode } from '../../theme/themes';

const MODES: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const SettingsBody = () => {
  const { theme, setTheme, mode, setMode } = useTheme();

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex flex-col gap-2">
        <Label>Theme</Label>
        <Select
          value={theme}
          onValueChange={(value) => setTheme(value as typeof theme)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Appearance</Label>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              type="button"
              variant={mode === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode(value)}
              className="flex-col gap-1 py-2 h-auto"
            >
              <Icon className="size-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const NavbarMenu = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          className={cn(
            'rounded-[inherit] text-muted-foreground hover:text-foreground'
          )}
        >
          <Settings className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <SettingsBody />
      </DialogContent>
    </Dialog>
  );
};
