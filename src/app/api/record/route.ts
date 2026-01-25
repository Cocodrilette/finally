import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createRecord, updateRecord, getRecordsByUser } from "@/db";
import { validateData, recordDTOSchema, type ApiResponse } from "@/lib/validation";

export const GET = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await getRecordsByUser(supabase, user.id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60',
        }
      }
    );
  } catch (error) {
    console.error("GET /api/record error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

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
    const validation = validateData(recordDTOSchema, { ...body, user_id: user.id });

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { data, error } = await createRecord(supabase, validation.data);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data },
      { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        }
      }
    );
  } catch (error) {
    console.error("POST /api/record error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest) => {
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
    const { id, ...recordData } = body;

    if (!id || typeof id !== "number") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Record ID is required" },
        { status: 400 }
      );
    }

    const validation = validateData(recordDTOSchema, { ...recordData, user_id: user.id });

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { data, error } = await updateRecord(supabase, validation.data, id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error("PATCH /api/record error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
