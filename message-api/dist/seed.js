"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be defined in your .env file');
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
const usersToCreate = [
    { email: 'john.doe@example.com', password: 'password123' },
    { email: 'jane.smith@example.com', password: 'password123' },
    { email: 'peter.jones@example.com', password: 'password123' },
    { email: 'susan.williams@example.com', password: 'password123' },
    { email: 'michael.brown@example.com', password: 'password123' },
    { email: 'linda.davis@example.com', password: 'password123' },
    { email: 'robert.miller@example.com', password: 'password123' },
    { email: 'patricia.wilson@example.com', password: 'password123' },
    { email: 'james.moore@example.com', password: 'password123' },
    { email: 'barbara.taylor@example.com', password: 'password123' },
];
async function main() {
    console.log('Starting to seed users...');
    for (const userData of usersToCreate) {
        const { data, error } = await supabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
        });
        if (error) {
            console.error(`Error creating user ${userData.email}:`, error.message);
        }
        else {
            console.log(`Successfully created user: ${data.user.email}`);
        }
    }
    console.log('User seeding complete.');
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map