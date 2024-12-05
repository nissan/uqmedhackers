import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://autyxlagbsrnvbatezdo.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data
    const data = await request.json();

    // Insert the data into the call_log table
    const { error } = await supabase
      .from('call_log')
      .insert([
        {
          call_json: data
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
      return NextResponse.json({ error: 'Failed to store data' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 