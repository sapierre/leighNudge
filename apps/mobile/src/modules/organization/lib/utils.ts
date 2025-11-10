import { z } from "zod";

import { MemberRole } from "@turbostarter/auth";

const roleSchema = z.enum(MemberRole);

export const toMemberRole = (role: unknown): MemberRole => {
  if (roleSchema.safeParse(role).success) {
    return roleSchema.parse(role);
  }

  return MemberRole.MEMBER;
};
