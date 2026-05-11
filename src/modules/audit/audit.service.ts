import { AuditAction } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export async function registerAudit(params: {
  userId: string;
  action: AuditAction;
  targetId?: string;
  detail?: string;
}): Promise<void> {
  await prisma.auditLog.create({ data: params });
}
