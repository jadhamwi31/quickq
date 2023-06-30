import {AppDataSource} from "../models";
import {Brand} from "../models/brand.model";
import {BadRequestError, NotFoundError} from "../models/error.model";
import {deleteImage} from "./upload.service";
import {isUndefined} from "lodash";
import RedisService from "./redis.service";

const setBrand = async (brand: Partial<Brand>) => {
    const brandRepository = AppDataSource.getRepository(Brand);
    const isNew = !(await brandRepository.findOneBy({}))
    const brandRecord = !isNew ? (await brandRepository.findOneBy({})) : new Brand();
    const oldName = brandRecord.name;
    brandRecord.name = brand.name;

    if (brand.slogan) brandRecord.slogan = brand.slogan;
    if (brand.logo !== undefined) {
        if (brandRecord.logo) deleteImage(brandRecord.logo);
        brandRecord.logo = brand.logo;
    }
    if (isNew) {
        await brandRepository.save(brandRecord);
    } else {
        await brandRepository.update({name: oldName}, brandRecord)
    }
    await RedisService.redis.set("brand", JSON.stringify(brandRecord))
};

const getBrand = async () => {
    const isCached = await RedisService.isCached("brand")
    if (isCached) {
        return JSON.parse(await RedisService.getCachedVersion("brand"))
    } else {
        const brandRepository = AppDataSource.getRepository(Brand);
        const brandRecord = await brandRepository.findOneBy({});
        return brandRecord;
    }
};

export const BrandService = {
    setBrand,
    getBrand,
};
