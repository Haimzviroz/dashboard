import { ChildGroupDto } from "@/api/src";

export interface Group extends ChildGroupDto {
  isCollapse?: boolean,
  isSelected?: boolean
}

export interface GroupRes {
  roots: number[];
  groups: { [key: string]: Group };
}
