import { PRESETS } from "@/data/presets";
import { useMounted } from "@/hooks/useMounted";
import { useCustomPresetsStore } from "@/store/useCustomPresetsStore";

export function usePresetResolver(presetId: string | undefined) {
  const isMounted = useMounted();
  const customPresets = useCustomPresetsStore((s) => s.customPresets);

  if (!presetId) return { preset: undefined, isLoading: false };

  const officialPreset = PRESETS.find((g) => g.id === presetId);
  if (officialPreset) return { preset: officialPreset, isLoading: false };

  if (!isMounted) return { preset: undefined, isLoading: true };

  const customPreset = customPresets.find((g) => g.id === presetId);
  return { preset: customPreset, isLoading: false };
}
