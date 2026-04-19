import { prisma } from "config/client";

const getHotProducts = async function () {
    const products = await prisma.product.findMany({
        where:{
            isHot : true
        }
    })
    return products
}

const getProductBySlug = async function name(slug:string) {
    const product = await prisma.product.findUnique({
        where:{
            slug: slug
        }
    })
    return product
}
export { getHotProducts, getProductBySlug}