import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { PostDoc } from "./post";

export interface DishDoc extends BaseDoc {
  name: String;
  post: PostDoc;
  location: ObjectId;
}

export default class DishConcept {
  public readonly dishes = new DocCollection<DishDoc>("dishes");

  async getDishes(dish: ObjectId) {
    return await this.dishes.readOne({ dish });
  }

  async addDish(name: String, post: PostDoc, location: ObjectId) {
    const _id = await this.dishes.createOne({ name, post, location });
    return { msg: "Post successfully created!", post: await this.dishes.readOne({ _id }) };
  }

  async updateDish(_id: ObjectId, user: Partial<DishDoc>) {
    // const dish = await this.dishes.readOne({ _id });
    await this.dishes.updateOne({ _id }, user);
    return { msg: "Dish updated successfully!" };
  }

  async deleteDish(_id: ObjectId) {
    await this.dishes.deleteOne({ _id });
    return { msg: "Dish deleted!" };
  }
}
