import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface LocationDoc extends BaseDoc {
  post: ObjectId;
  address: string;
}

export default class LocationConcept {
  public readonly locations = new DocCollection<LocationDoc>("locations");

  async createLocation(post: ObjectId, address: string) {
    const _id = await this.locations.createOne({ post, address });
    return { msg: "Location successfully created!", post: await this.locations.readOne({ _id }) };
  }

  async getLocation(_id: ObjectId) {
    return await this.locations.readOne({ _id });
  }

  async updateLocation(_id: ObjectId, address: Partial<LocationDoc>) {
    await this.locations.updateOne({ _id }, address);
    return { msg: "Location updated successfully!" };
  }

  async deleteLocation(_id: ObjectId) {
    await this.locations.deleteOne({ _id });
    return { msg: "Location deleted!" };
  }
}
