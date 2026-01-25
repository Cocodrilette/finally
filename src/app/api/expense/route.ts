import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createExpense } from "@/db";
import { validateData, expenseDTOSchema, type ApiResponse } from "@/lib/validation";

export const POST = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = validateData(expenseDTOSchema, { ...body, user_id: user.id });

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { data, error } = await createExpense(supabase, validation.data);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/expense error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
