import prisma from "./prisma";

// interface RoleEntity {
//   [key: number]: {
//     access: boolean;
//   } & Record<string, boolean>;
// }

type RoleEntity = Record<number, { access: boolean } & Record<string, boolean>>;

async function createMasterRoles(where: any, role: RoleEntity) {
  console.log("Creating Master roles : ", where?.name);
  const accessRole = await prisma.accessRole.findFirst({
    where: where,
  });
  if (!accessRole) {
    return await prisma.accessRole.create({
      data: {
        ...where,
        role: role,
      },
    });
  } else {
    return await prisma.accessRole.update({
      where: {
        id: accessRole.id,
      },
      data: {
        role: role,
      },
    });
  }
}

async function seed() {
  console.log("Started seeding db");
  console.log("Creating Master roles");

  try {
    const promise1 = createMasterRoles(
      {
        is_master: true,
        for_type: "employee",
        name: "Employee",
      },
      { 0: { access: true } }
    );
    const promise2 = createMasterRoles(
      {
        is_master: true,
        for_type: "manager",
        name: "Manager",
      },
      { 0: { access: true } }
    );
    const promise3 = createMasterRoles(
      {
        is_master: true,
        for_type: "admin",
        name: "Admin",
      },
      { 0: { access: true } }
    );
    const promise4 = createMasterRoles(
      {
        is_master: true,
        for_type: "super_admin",
        name: "Super Admin",
      },
      {
        0: { access: true, super_admin: true },
        1: { access: true },
        2: { access: true },
        3: { access: true, add: true, edit: true },
      }
    );

    const [p1, p2, p3, adminRole] = await Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
    ]);
    console.log("Created default roles");

    // To create admin user:
    // await prisma.user.update({
    //   where: {
    //     email: "",
    //   },
    //   data: {
    //     user_type: "super_admin",
    //     access_role_id: adminRole.id,
    //   },
    // });
  } catch (error) {
    console.error("Error while seeding : ", error);
  }
}

seed();
