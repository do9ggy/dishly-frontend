import CommentConcept from "./concepts/comment";
import DishConcept from "./concepts/dish";
import FriendConcept from "./concepts/friend";
import LocationConcept from "./concepts/location";
import PostConcept from "./concepts/post";
import RestaurantConcept from "./concepts/restaurant";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Comment = new CommentConcept();
export const Dish = new DishConcept();
export const Location = new LocationConcept();
export const Restaurant = new RestaurantConcept();
