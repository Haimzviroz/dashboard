import { Group } from "@/types/interfaces/devices";
import type { GroupResponseDto } from "@/api/src/api";

export type DropCheckResult = {
  allowed: boolean;
  reason?: string;
};

export function getGroupDropValidation(
  item: Group,
  group: Group,
  groupsData?: GroupResponseDto,
  selfReason = "אי אפשר לשייך קבוצה לעצמה",
  alreadyChildReason = "הקבוצה כבר משויכת לקבוצה זו",
  parentReason = "לא ניתן לשייך קבוצה לאחת מהקבוצות שתחתיה"
): DropCheckResult {
  if (item.id === group.id) {
    return { allowed: false, reason: selfReason };
  }
  if (item.parent === group.id) {
    return { allowed: false, reason: alreadyChildReason };
  }
  const notParent = (item: Group, cGroup: Group): boolean => {
    if (!cGroup.parent) return true;
    if (cGroup.parent === item.id) return false;
    const parent = groupsData?.groups[cGroup.parent];
    return parent ? notParent(item, parent) : true;
  };
  const isParent = !notParent(item, group);
  if (isParent) {
    return { allowed: false, reason: parentReason };
  }
  return { allowed: true };
}
