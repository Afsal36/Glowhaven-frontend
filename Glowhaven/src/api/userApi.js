

import api from "./axios";

export const getUserProfile = () => api.get("/users/profile");
