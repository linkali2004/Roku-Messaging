import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '@/models/UserModel';
import mongoose from 'mongoose';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('tokenJWT')?.value;

  if (token) {
    try {
      const decoded = jwt.decode(token);
      return NextResponse.json({ username: decoded.username ,id:decoded.id});
    } catch (error) {
      return NextResponse.json({ error: 'Failed to decode token' }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'Token not found' }, { status: 401 });
  }
}

export async function POST(request) {
  const reqBody = await request.json();
  try
  {
    const response = await User.findOne({_id:new mongoose.Types.ObjectId(reqBody)});
    return NextResponse.json({message:response,status:200})
  }catch(e)
  {
    console.log(e);
    return NextResponse.json({username:"Not Found",status:404})
  }
}
