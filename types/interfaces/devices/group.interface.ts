export interface Group {
  name: string,
  id: number,
  parent: number | null,
  groups: number[],
  isCollapse?: boolean,
  isSelected?: boolean
}

export interface GroupRes {
  roots: number[];
  groups: { [key: string]: Group };
}
