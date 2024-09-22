import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/UserModel";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";



export async function POST(request) {
  await connect();
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    const user = await User.findOne({ username: reqBody.username });
    if (user) {
      return NextResponse.json({
        message: `User with name ${username} already exists`,
        status: 404,
      });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const tokenData = {
      id: savedUser._id,
      username: savedUser.username,
      avatar: savedUser.avatar || "",
    };

    const token = await jwt.sign(tokenData, process.env.TOKENSECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("tokenJWT", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: e.message, status: 404 });
  }
}
