export interface MultiSelectOption {
  label: string;
  value: number;
}

export interface MultiSelectProps {
  mt: number;
  label: string;
  options: MultiSelectOption[];
  selectedOptions: number[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>;
  placeholder?: string;
}
