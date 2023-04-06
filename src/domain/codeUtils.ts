type EnumType = { [s: number]: string };

export function mapEnum(enumerable: EnumType, fn: Function): any[] {
    let enumMembers: any[] = Object.keys(enumerable).map((key: any) => enumerable[key]);

    let enumValues: number[] = enumMembers.filter(v => typeof v === "number");

    return enumValues.map(m => fn(m));
}