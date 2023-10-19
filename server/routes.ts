import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Comment, Dish, Friend, Location, Post, Restaurant, User, WebSession } from "./app";
import { DishDoc } from "./concepts/dish";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/comments")
  async getComments(post?: string) {
    let comments;
    if (post) {
      const id = (await User.getUserByUsername(post))._id;
      comments = await Comment.getByAuthor(id);
    } else {
      comments = await Comment.getComments({});
    }
    return Responses.comments(comments);
  }

  @Router.post("/comments")
  async createComment(session: WebSessionDoc, post: ObjectId, content: string) {
    const user = WebSession.getUser(session);
    const created = await Comment.create(user, content);
    return { msg: created.msg, comment: await Responses.comment(created.comment) };
  }

  @Router.patch("/comments/:_id")
  async updateComment(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(user, _id);
    return await Comment.update(_id, update);
  }

  @Router.delete("/comments/:_id")
  async deleteComment(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(user, _id);
    return Comment.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  @Router.get("/dishes/:dishes")
  async getDishes(dish: ObjectId) {
    return await Dish.getDishes(dish);
  }

  @Router.post("/dishes")
  async addDish(session: WebSessionDoc, dish: DishDoc, location: ObjectId) {
    const user = WebSession.getUser(session);
    const post = await Post.getPosts(user);
    // return await Dish.addDish(post[0]._id, dish, location);
  }

  @Router.patch("/dishes")
  async updateDish(session: WebSessionDoc, dish: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await Dish.updateDish(user, dish);
  }

  @Router.delete("/dishes")
  async deleteDish(dish: ObjectId) {
    return await Dish.deleteDish(dish);
  }

  @Router.get("/locations/:locations")
  async getLocation(location: ObjectId) {
    return await Location.getLocation(location);
  }

  @Router.post("/locations")
  async addLocation(post: ObjectId, location: string) {
    return await Location.createLocation(post, location);
  }

  @Router.patch("/locations")
  async updateLocations(_id: ObjectId, location: Partial<UserDoc>) {
    return await Location.updateLocation(_id, location);
  }

  @Router.delete("/locations")
  async deleteLocation(_id: ObjectId) {
    return await Location.deleteLocation(_id);
  }

  @Router.get("/restaurants/:restaurants")
  async getRestaurant(restaurant: ObjectId) {
    return await Restaurant.getRestaurant(restaurant);
  }

  @Router.post("/restaurants")
  async addRestaurant(_id: ObjectId, location: ObjectId) {
    return await Restaurant.createRestaurant(_id, location);
  }

  @Router.patch("/restaurants")
  async updateRestaurant(_id: ObjectId, address: Partial<UserDoc>) {
    return await Restaurant.updateRestaurant(_id, address);
  }

  @Router.delete("/restaurants")
  async deleteRestaurant(restaurant: ObjectId) {
    return await Restaurant.deleteRestaurant(restaurant);
  }
}

export default getExpressRouter(new Routes());
