import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface RestaurantDoc extends BaseDoc {
  dish: ObjectId;
  location: ObjectId;
}

export default class RestaurantConcept {
  public readonly restaurants = new DocCollection<RestaurantDoc>("restaurants");

  async createRestaurant(dish: ObjectId, location: ObjectId) {
    const _id = await this.restaurants.createOne({ dish, location });
    return { msg: "Restaurant successfully created!", post: await this.restaurants.readOne({ _id }) };
  }

  async getRestaurant(_id: ObjectId) {
    return await this.restaurants.readOne({ _id });
  }

  async updateRestaurant(_id: ObjectId, address: Partial<RestaurantDoc>) {
    await this.restaurants.updateOne({ _id }, address);
    return { msg: "Restaurant updated successfully!" };
  }

  async deleteRestaurant(_id: ObjectId) {
    await this.restaurants.deleteOne({ _id });
    return { msg: "Restaurant deleted!" };
  }
}
