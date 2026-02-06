// src/app.ts
import express from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ===== ENUMS =====\nenum Role {\n  TUTOR\n  STUDENT\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n  PENDING\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nenum dayOfWeek {\n  SUNDAY\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n  SATURDAY\n}\n\nenum Subjects {\n  // General\n  MATH\n  ENGLISH\n  SCIENCE\n\n  // Specific Math\n  CALCULUS\n  ALGEBRA\n  GEOMETRY\n\n  // Science\n  PHYSICS\n  CHEMISTRY\n  BIOLOGY\n  ICT\n\n  // Business\n  ACCOUNTING\n  FINANCE\n  ECONOMICS\n  MARKETING\n\n  // Tech\n  PROGRAMMING\n  WEB_DEVELOPMENT\n  DATA_SCIENCE\n\n  // Prep\n  IELTS\n  ADMISSION_TEST\n}\n\n// ===== AUTH MODELS =====\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role   Role\n  phone  String?\n  status UserStatus? @default(ACTIVE)\n\n  // Profiles \n  studentProfile StudentProfile?\n  tutorProfile   TutorProfile?\n  reviews        Review[]\n\n  // Bookings\n  bookingsAsStudent Booking[] @relation("StudentBookings")\n  bookingsAsTutor   Booking[] @relation("TutorBookings")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// ===== STUDENT MODELS =====\nmodel StudentProfile {\n  id     String  @id @default(uuid())\n  userId String  @unique\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  bio    String?\n\n  createdAt DateTime @default(now())\n}\n\n// ===== TUTOR MODELS =====\nmodel TutorProfile {\n  id              String  @id @default(uuid())\n  userId          String  @unique\n  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  bio             String?\n  experienceYears Int\n  hourlyRate      Int\n  rating          Float   @default(0)\n  totalReviews    Int     @default(0)\n  isApproved      Boolean @default(true)\n  isFeatured      Boolean @default(false)\n\n  category       Category[]\n  subjects       Subjects[]\n  availabilities Availability[]\n  reviews        Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Availability {\n  id        String       @id @default(uuid())\n  tutorId   String\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  dayOfWeek dayOfWeek[]\n  startTime String\n  endTime   String\n  isActive  Boolean      @default(true)\n}\n\n// ===== CATEGORY MODELS =====\n// Category model will be like University Teacher, College Teacher, High School Teacher, Primary School Teacher and English Medium Teacher, Bangla Medium Teacher etc.\nmodel Category {\n  id            String         @id @default(uuid())\n  name          String\n  description   String?\n  TutorProfiles TutorProfile[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  // tutors   TutorCategory[] \n}\n\n// model TutorCategory {\n//   tutorId    String\n//   categoryId String\n\n//   tutor    TutorProfile @relation(fields: [tutorId], references: [id])\n//   category Category     @relation(fields: [categoryId], references: [id])\n\n//   @@id([tutorId, categoryId])\n// }\n\n// ===== BOOKING & REVIEW MODELS =====\nmodel Booking {\n  id        String @id @default(uuid())\n  studentId String\n  tutorId   String\n\n  student User @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)\n  tutor   User @relation("TutorBookings", fields: [tutorId], references: [id], onDelete: Cascade)\n\n  subject Subjects\n\n  date      DateTime\n  startTime String\n  endTime   String\n  price     Int\n\n  status BookingStatus @default(CONFIRMED)\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, tutorId, date, startTime])\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  studentId String\n  tutorId   String\n\n  student User         @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n\n  rating  Int\n  comment String?\n\n  createdAt DateTime @default(now())\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"bookingsAsStudent","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"bookingsAsTutor","kind":"object","type":"Booking","relationName":"TutorBookings"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"subjects","kind":"enum","type":"Subjects"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"dayOfWeek","kind":"enum","type":"dayOfWeek"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"TutorProfiles","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"User","relationName":"TutorBookings"},{"name":"subject","kind":"enum","type":"Subjects"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/modules/tutor/tutor.routes.ts
import { Router } from "express";

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({ success: false, message: "You are not authenticated, You need to login First" });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to access this resource"
        });
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
var auth_default = auth2;

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (option) => {
  const page = Number(option.page) || 1;
  const limit = Number(option.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = option.sortBy || "createdAt";
  const sortOrder = option.sortOrder || "desc";
  return { page, limit, skip, sortBy, sortOrder };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/modules/tutor/tutor.service.ts
var getAllTutors = async (queries) => {
  try {
    const andConditions = [];
    const { page, skip, limit, sortBy, sortOrder } = paginationSortingHelper_default(queries);
    if (queries.subject) {
      andConditions.push({
        subjects: {
          has: queries.subject
        }
      });
    }
    if (queries.experienceYears) {
      andConditions.push({
        experienceYears: {
          gte: Number(queries.experienceYears)
        }
      });
    }
    if (queries.hourlyRate) {
      andConditions.push({
        hourlyRate: {
          lte: Number(queries.hourlyRate)
        }
      });
    }
    const orderbyConditions = {};
    if (queries.sortOrder === "asc") {
      orderbyConditions.tutorProfile = {
        hourlyRate: "asc"
      };
    } else if (queries.sortOrder === "desc") {
      orderbyConditions.tutorProfile = {
        hourlyRate: "desc"
      };
    }
    if (sortBy) {
      orderbyConditions.tutorProfile = {
        [sortBy]: sortOrder
      };
    }
    if (queries.isFeatured) {
      const isFeaturedBool = queries.isFeatured === "true" ? true : false;
      andConditions.push({
        isFeatured: isFeaturedBool
      });
    }
    if (queries.isApproved) {
      const isApprovedBool = queries.isApproved === "true" ? true : false;
      andConditions.push({
        isApproved: isApprovedBool
      });
    }
    const result = await prisma.user.findMany({
      skip,
      take: limit,
      where: {
        status: "ACTIVE",
        role: "TUTOR",
        tutorProfile: {
          AND: andConditions
        }
      },
      include: {
        tutorProfile: true
      },
      orderBy: orderbyConditions
    });
    const total = await prisma.tutorProfile.count({
      where: {
        AND: andConditions
      }
    });
    return {
      data: result,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching all tutors failed");
  }
};
var createTutorProfile = async (tutorData) => {
  try {
    const { category, availabilities, ...rest } = tutorData;
    const formattedAvailabilities = [];
    if (availabilities && Array.isArray(availabilities)) {
      for (const slot of availabilities) {
        if (slot.dayOfWeek && Array.isArray(slot.dayOfWeek)) {
          formattedAvailabilities.push({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime
          });
        }
      }
    }
    const result = await prisma.tutorProfile.create({
      data: {
        ...rest,
        ...category && {
          category: {
            connect: category.map((catId) => ({ id: catId }))
          }
        },
        ...formattedAvailabilities.length > 0 && {
          availabilities: {
            create: formattedAvailabilities
          }
        }
      },
      include: {
        user: true,
        availabilities: true,
        category: true,
        reviews: true
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Creating tutor profile failed");
  }
};
var updateTutorProfileAvailability = async (userId, tutorData) => {
  try {
    const availabilities = tutorData;
    const formattedAvailabilities = [];
    if (availabilities && Array.isArray(availabilities)) {
      for (const slot of availabilities) {
        if (slot.dayOfWeek && Array.isArray(slot.dayOfWeek)) {
          formattedAvailabilities.push({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime
          });
        }
      }
    }
    const result = await prisma.tutorProfile.update({
      where: { userId },
      data: {
        ...formattedAvailabilities && {
          availabilities: {
            deleteMany: {},
            create: formattedAvailabilities
          }
        }
      },
      include: {
        availabilities: {
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Updating tutor profile failed");
  }
};
var updateTutorProfile = async (userId, tutorData) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const { name, image, hourlyRate, bio } = tutorData;
      if (name || image) {
        await tx.user.update({
          where: { id: userId },
          data: {
            ...name && { name },
            ...image && { image }
          }
        });
      }
      if (hourlyRate || bio) {
        await tx.tutorProfile.update({
          where: { userId },
          data: {
            ...bio && { bio },
            ...hourlyRate && { hourlyRate }
          }
        });
      }
      const updatedData = await tx.user.findUnique({
        where: { id: userId },
        include: {
          tutorProfile: true
        }
      });
      return updatedData;
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Updating tutor profile failed");
  }
};
var seeRatingAndReviews = async (tutorId) => {
  try {
    const result = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      select: {
        rating: true,
        totalReviews: true,
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            // get student info 
            student: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching tutor reviews failed");
  }
};
var getTutorProfile = async (tutorId) => {
  try {
    const result = await prisma.tutorProfile.findUnique({
      where: {
        userId: tutorId
      },
      include: {
        user: true,
        availabilities: true,
        category: true,
        reviews: {
          include: {
            student: true
          }
        }
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching tutor profile failed");
  }
};
var getTutorStats = async (tutorId) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const tutorProfile = await tx.tutorProfile.findUnique({
        where: {
          id: tutorId
        },
        select: {
          id: true
        }
      });
      const totalBooking = await tx.booking.count({
        where: {
          tutorId,
          status: "COMPLETED"
        }
      });
      const totalRevenue = await tx.booking.aggregate({
        where: {
          tutorId,
          status: "COMPLETED"
        },
        _sum: {
          price: true
        }
      });
      const totalReviews = await tx.review.count({
        where: { tutorId }
      });
      const totalRatings = await tx.tutorProfile.aggregate({
        where: {
          id: tutorId
        },
        _sum: {
          rating: true
        }
      });
      const totalCancelled = await tx.booking.count({
        where: {
          tutorId,
          status: "CANCELLED"
        }
      });
      const inprogressBooking = await tx.booking.count({
        where: {
          tutorId,
          status: "CONFIRMED"
        }
      });
      return {
        totalBooking,
        totalRevenue,
        totalReviews,
        totalRatings: totalRatings._sum.rating,
        totalCancelled,
        inprogressBooking
      };
    }, {
      maxWait: 5e3,
      timeout: 1e4
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching tutor stats failed");
  }
};
var tutorServices = {
  createTutorProfile,
  updateTutorProfileAvailability,
  updateTutorProfile,
  seeRatingAndReviews,
  getAllTutors,
  getTutorProfile,
  getTutorStats
};

// src/modules/tutor/tutor.controller.ts
var getAllTutor = async (req, res) => {
  try {
    const queries = req.query;
    const result = await tutorServices.getAllTutors(queries);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var updateTutorProfileAvailability2 = async (req, res) => {
  try {
    const tutorId = req.user?.id;
    const updateData = req.body;
    const result = await tutorServices.updateTutorProfileAvailability(tutorId, updateData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var updateTutorProfile2 = async (req, res) => {
  try {
    const tutorId = req.user?.id;
    const updateData = req.body;
    const result = await tutorServices.updateTutorProfile(tutorId, updateData);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var seeRatingAndReviews2 = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const result = await tutorServices.seeRatingAndReviews(tutorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getTutorProfile2 = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const result = await tutorServices.getTutorProfile(tutorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getTutorStats2 = async (req, res) => {
  try {
    const tutorId = req.user?.id;
    const result = await tutorServices.getTutorStats(tutorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var tutorController = {
  updateTutorProfileAvailability: updateTutorProfileAvailability2,
  seeRatingAndReviews: seeRatingAndReviews2,
  getAllTutor,
  getTutorProfile: getTutorProfile2,
  getTutorStats: getTutorStats2,
  updateTutorProfile: updateTutorProfile2
};

// src/modules/tutor/tutor.routes.ts
var router = Router();
router.get("/all-tutors", tutorController.getAllTutor);
router.get("/tutor-stats", auth_default("TUTOR" /* TUTOR */), tutorController.getTutorStats);
router.get("/profile/:tutorId", tutorController.getTutorProfile);
router.put("/update-tutor-availability", auth_default("TUTOR" /* TUTOR */), tutorController.updateTutorProfileAvailability);
router.put("/update-tutor-profile", auth_default("TUTOR" /* TUTOR */), tutorController.updateTutorProfile);
router.get("/ratings-reviews/:tutorId", auth_default("TUTOR" /* TUTOR */, "ADMIN" /* ADMIN */), tutorController.seeRatingAndReviews);
var tutorRouter = router;

// src/modules/student/student.routes.ts
import { Router as Router2 } from "express";

// src/modules/student/student.service.ts
var createStudentProfile = async (studentInfo) => {
  try {
    const result = await prisma.studentProfile.create({
      data: {
        userId: studentInfo.userId,
        bio: studentInfo.bio ? studentInfo.bio : ""
      },
      include: {
        user: true
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Creating student profile failed");
  }
};
var studentProfileStats = async (studentId) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const bookingsCount = await tx.booking.count({
        where: {
          studentId,
          status: "COMPLETED"
        }
      });
      const inProgressBooking = await tx.booking.count({
        where: {
          studentId,
          status: "CONFIRMED"
        }
      });
      const reviewsCount = await tx.review.count({
        where: {
          studentId
        }
      });
      const totalSpentAgg = await tx.booking.aggregate({
        where: {
          studentId,
          status: "COMPLETED"
        },
        _sum: {
          price: true
        }
      });
      const totalCancelled = await tx.booking.count({
        where: {
          studentId,
          status: "CANCELLED"
        }
      });
      return {
        totalSpentAgg,
        bookingsCount,
        reviewsCount,
        totalCancelled,
        inProgressBooking
      };
    }, {
      maxWait: 5e3,
      timeout: 1e4
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching student profile stats failed");
  }
};
var getCurrentUser = async (userId, role) => {
  try {
    const dynamicProfileInclude = role === "TUTOR" /* TUTOR */ ? { tutorProfile: true } : role === "STUDENT" /* STUDENT */ ? { studentProfile: true } : {};
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ...dynamicProfileInclude
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching current user failed");
  }
};
var updateStudentProfile = async (userId, userData) => {
  try {
    const { name, bio, image } = userData;
    const result = await prisma.$transaction(async (tx) => {
      if (name || image) {
        await tx.user.update({
          where: { id: userId },
          data: {
            ...name && { name },
            ...image && { image }
          }
        });
      }
      if (bio) {
        await tx.studentProfile.update({
          where: { userId },
          data: {
            bio
          }
        });
      }
      const updatedData = await tx.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: true
        }
      });
      return updatedData;
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Updating student profile failed");
  }
};
var cancelBooking = async (bookingId) => {
  try {
    const result = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED"
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Cancelling booking failed");
  }
};
var studentService = {
  createStudentProfile,
  studentProfileStats,
  getCurrentUser,
  updateStudentProfile,
  cancelBooking
};

// src/modules/student/student.controller.ts
var studentProifleStats = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const stats = await studentService.studentProfileStats(studentId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getCurrentUser2 = async (req, res) => {
  try {
    const { id, role } = req.user;
    const result = await studentService.getCurrentUser(id, role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var updateStudentProfile2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userData = req.body;
    const result = await studentService.updateStudentProfile(userId, userData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var cancelBooking2 = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await studentService.cancelBooking(bookingId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var studentController = {
  studentProifleStats,
  getCurrentUser: getCurrentUser2,
  updateStudentProfile: updateStudentProfile2,
  cancelBooking: cancelBooking2
};

// src/modules/student/student.routes.ts
var router2 = Router2();
router2.get("/student-profile/stats/:studentId", studentController.studentProifleStats);
router2.put("/update-student-profile/:userId", auth_default("STUDENT" /* STUDENT */), studentController.updateStudentProfile);
router2.put("/cancel-booking/:bookingId", auth_default("STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */), studentController.cancelBooking);
var studentRoutes = router2;

// src/modules/register/register.routes.ts
import { Router as Router3 } from "express";

// src/modules/register/register.service.ts
var register = async (userData) => {
  let userId = null;
  try {
    const { profile, ...registerData } = userData;
    const isExistingUser = await prisma.user.findUnique({
      where: { email: registerData.email }
    });
    if (isExistingUser) {
      throw new Error("User with this email already exists");
    }
    const result = await auth.api.signUpEmail({
      body: {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role
      }
    });
    if (!result.user) {
      throw new Error("Registration failed");
    }
    userId = result.user.id;
    let response = null;
    if (userData.role === "TUTOR" /* TUTOR */) {
      response = await tutorServices.createTutorProfile({
        userId,
        ...profile
      });
    }
    if (userData.role === "STUDENT" /* STUDENT */) {
      response = await studentService.createStudentProfile({
        userId,
        ...profile
      });
    }
    return response;
  } catch (error) {
    if (userId) {
      try {
        await prisma.user.delete({
          where: { id: userId }
        });
      } catch (deleteError) {
        throw new Error("Registration failed. Additionally, failed to clean up user data.");
      }
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Registration failed");
  }
};
var getCurrentUser3 = async (userId, role) => {
  try {
    const dynamicProfileInclude = role === "TUTOR" /* TUTOR */ ? { tutorProfile: true } : role === "STUDENT" /* STUDENT */ ? { studentProfile: true } : {};
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ...dynamicProfileInclude
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching current user failed");
  }
};
var registrationServices = {
  register,
  getCurrentUser: getCurrentUser3
};

// src/modules/register/register.controller.ts
var register2 = async (req, res) => {
  try {
    const userData = req.body;
    const response = await registrationServices.register(userData);
    res.status(201).json({ message: "Registration successful", data: response });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getCurrentUser4 = async (req, res) => {
  try {
    const { id, role } = req.user;
    const result = await registrationServices.getCurrentUser(id, role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var registerController = {
  register: register2,
  getCurrentUser: getCurrentUser4
};

// src/modules/register/register.routes.ts
var router3 = Router3();
router3.get("/current-user", auth_default("ADMIN" /* ADMIN */, "STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */), registerController.getCurrentUser);
router3.post("/register", registerController.register);
var registerRouter = router3;

// src/modules/admin/admin.routes.ts
import { Router as Router4 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async (isActive, page, limit) => {
  try {
    const { page: currentPage, limit: currentLimit, sortBy, sortOrder, skip } = paginationSortingHelper_default({ page, limit });
    const result = await prisma.user.findMany({
      skip,
      take: currentLimit,
      where: {
        status: isActive
      }
    });
    const total = await prisma.user.count({});
    return {
      data: result,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit)
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching all users failed");
  }
};
var manageUserStatus = async (userId, isActive) => {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        status: isActive
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Managing user status failed");
  }
};
var createCategory = async (categoryData) => {
  try {
    const result = await prisma.category.create({
      data: {
        ...categoryData
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Creating category failed");
  }
};
var getAllCategories = async () => {
  try {
    const result = await prisma.category.findMany({});
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching all categories failed");
  }
};
var getAllStats = async () => {
  try {
    const stats = await prisma.$transaction(async (tx) => {
      const totalUser = await tx.user.count({});
      const totalTutors = await tx.user.count({
        where: { role: "TUTOR" /* TUTOR */ }
      });
      const totalStudents = await tx.user.count({
        where: { role: "STUDENT" /* STUDENT */ }
      });
      const totalBookings = await tx.booking.count({});
      const totalCategories = await tx.category.count({});
      const totalSale = await tx.booking.aggregate({
        _sum: {
          price: true
        }
      });
      const avgSale = await tx.booking.aggregate({
        _avg: {
          price: true
        }
      });
      const totalBanUsers = await tx.user.count({
        where: { status: "BANNED" }
      });
      return {
        totalUser,
        totalTutors,
        totalStudents,
        totalBookings,
        totalCategories,
        totalSale,
        avgSale,
        totalBanUsers
      };
    });
    return stats;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching stats failed");
  }
};
var getAllBookings = async () => {
  try {
    const result = await prisma.booking.findMany({});
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching all bookings failed");
  }
};
var adminServices = {
  getAllUsers,
  manageUserStatus,
  createCategory,
  getAllCategories,
  getAllStats,
  getAllBookings
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const { isActive, page, limit } = req.query;
    const result = await adminServices.getAllUsers(isActive, Number(page), Number(limit));
    const refineData = result.data.length === 0 ? "No Users Found" : result;
    res.status(200).json({ success: true, data: refineData });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var manageUserStatus2 = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { status } = req.body;
    console.log(status);
    const result = await adminServices.manageUserStatus(userId, status);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var createCategory2 = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await adminServices.createCategory({ name, description });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const result = await adminServices.getAllCategories();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getAllStats2 = async (req, res) => {
  try {
    const result = await adminServices.getAllStats();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getAllBookings2 = async (req, res) => {
  try {
    const result = await adminServices.getAllBookings();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var adminController = {
  getAllUsers: getAllUsers2,
  manageUserStatus: manageUserStatus2,
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getAllStats: getAllStats2,
  getAllBookings: getAllBookings2
};

// src/modules/admin/admin.routes.ts
var router4 = Router4();
router4.get("/all-users", auth_default("ADMIN" /* ADMIN */), adminController.getAllUsers);
router4.get("/all-bookings", auth_default("ADMIN" /* ADMIN */), adminController.getAllBookings);
router4.get("/stats", auth_default("ADMIN" /* ADMIN */), adminController.getAllStats);
router4.put("/manage-user/:userId", auth_default("ADMIN" /* ADMIN */), adminController.manageUserStatus);
router4.post("/create-category", auth_default("ADMIN" /* ADMIN */), adminController.createCategory);
router4.get("/all-categories", adminController.getAllCategories);
var adminRouter = router4;

// src/modules/booking/booking.routes.ts
import { Router as Router5 } from "express";

// src/modules/booking/booking.service.ts
var getAllBookings3 = async () => {
  try {
    const result = await prisma.booking.findMany({});
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching all bookings failed");
  }
};
var createBooking = async (bookingData) => {
  try {
    const existingBooking = await prisma.booking.count({
      where: {
        tutorId: bookingData.tutorId,
        date: new Date(bookingData.date),
        startTime: bookingData.startTime
      }
    });
    if (existingBooking > 10) {
      throw new Error("Tutor is fully booked for the selected time slot");
    }
    const { date, ...rest } = bookingData;
    const result = await prisma.booking.create({
      data: {
        date: new Date(date),
        ...rest
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Creating booking failed");
  }
};
var getUsersBookings = async (userId, role) => {
  try {
    const rolebasedFilter = role === "STUDENT" /* STUDENT */ ? { studentId: userId } : { tutorId: userId };
    const result = await prisma.booking.findMany({
      where: {
        ...rolebasedFilter
      },
      include: {
        tutor: {
          include: {
            tutorProfile: true
          }
        },
        student: true
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching user's bookings failed");
  }
};
var getBookingDetails = async (bookingId) => {
  try {
    const result = await prisma.booking.findUnique({
      where: {
        id: bookingId
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Fetching booking details failed");
  }
};
var markBookingAsCompleted = async (bookingId) => {
  try {
    const result = await prisma.booking.update({
      where: {
        id: bookingId
      },
      data: {
        status: "COMPLETED"
      }
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Marking booking as completed failed");
  }
};
var bookingServices = {
  getAllBookings: getAllBookings3,
  createBooking,
  getUsersBookings,
  getBookingDetails,
  markBookingAsCompleted
};

// src/modules/booking/booking.controller.ts
var getAllBookings4 = async (req, res) => {
  try {
    const result = await bookingServices.getAllBookings();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var createBooking2 = async (req, res) => {
  try {
    const bookingData = req.body;
    const result = await bookingServices.createBooking(bookingData);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getUsersBookings2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const result = await bookingServices.getUsersBookings(userId, role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var getBookingDetails2 = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await bookingServices.getBookingDetails(bookingId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var markBookingAsCompleted2 = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    console.log(bookingId);
    const result = await bookingServices.markBookingAsCompleted(bookingId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var bookingController = {
  getAllBookings: getAllBookings4,
  createBooking: createBooking2,
  getUsersBookings: getUsersBookings2,
  getBookingDetails: getBookingDetails2,
  markBookingAsCompleted: markBookingAsCompleted2
};

// src/modules/booking/booking.routes.ts
var router5 = Router5();
router5.get("/all-bookings", auth_default("STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */), bookingController.getAllBookings);
router5.post("/create-booking", bookingController.createBooking);
router5.get("/user-bookings", auth_default("STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */), bookingController.getUsersBookings);
router5.get("/booking-details/:bookingId", bookingController.getBookingDetails);
router5.put("/mark-booking-as-completed/:bookingId", auth_default("TUTOR" /* TUTOR */), bookingController.markBookingAsCompleted);
var bookingRouter = router5;

// src/modules/review/review.routes.ts
import { Router as Router6 } from "express";

// src/modules/review/review.service.ts
var createReview = async (reviewData) => {
  try {
    return await prisma.$transaction(
      async (tx) => {
        const existingReview = await tx.review.findUnique({
          where: {
            bookingId: reviewData.bookingId
            // Ensure your interface has this
          }
        });
        if (existingReview) {
          throw new Error("You have already reviewed this booking!");
        }
        const newReview = await tx.review.create({
          data: {
            ...reviewData
          }
        });
        const aggregations = await tx.review.aggregate({
          where: {
            tutorId: reviewData.tutorId
          },
          _count: {
            rating: true
          },
          _avg: {
            rating: true
          }
        });
        const totalReviews = aggregations._count.rating;
        const averageRatings = aggregations._avg.rating || 0;
        await tx.tutorProfile.update({
          where: {
            id: reviewData.tutorId
          },
          data: {
            totalReviews,
            rating: parseFloat(averageRatings.toFixed(2))
          }
        });
        return newReview;
      },
      {
        maxWait: 5e3,
        timeout: 1e4
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Creating review failed");
  }
};
var reviewServices = {
  createReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const reviewData = req.body;
    const result = await reviewServices.createReview(reviewData);
    console.log(result);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
var reviewController = {
  createReview: createReview2
};

// src/modules/review/review.routes.ts
var router6 = Router6();
router6.post("/create-review", reviewController.createReview);
var reviewRouter = router6;

// src/app.ts
var app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.APP_URL,
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Skill Bridge Server is running");
});
app.use("/user", registerRouter);
app.use("/tutor", tutorRouter);
app.use("/student", studentRoutes);
app.use("/admin", adminRouter);
app.use("/booking", bookingRouter);
app.use("/review", reviewRouter);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
