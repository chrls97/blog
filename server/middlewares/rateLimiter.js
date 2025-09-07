import  { rateLimit } from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each ip to 200 request per windows
  message: { success:false, message: "Too many request, please try again later."}
})

export const strictRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each ip to 5 request per windows
  message: { success:false, message: "Too many request, please try again after 5 minutes."}
})

export const moderateRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 20, // Limit each ip to 5 request per windows
  message: { success:false, message: "Too many request, please try again later."}
})