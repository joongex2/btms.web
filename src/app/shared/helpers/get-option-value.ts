export function getOptionValue(selectedOption: any) {
    if (typeof selectedOption === 'string') {
        return selectedOption ? selectedOption : undefined;
    } else {
        return selectedOption?.value ? selectedOption.value : undefined;
    }
}