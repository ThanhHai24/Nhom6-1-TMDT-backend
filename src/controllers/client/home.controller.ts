import { Request, Response } from "express";
import { getHotProducts, getProductBySlug } from "services/client/product.services";
const getHomePage = async (req: Request, res: Response) => {
    const hotproducts = await getHotProducts();
    console.log(hotproducts)
    res.render("StorePage/homepage/index", {
        hotproducts: hotproducts
    });
}

const getProductPage = async (req: Request, res: Response) => {
    const slug = await req.params.slug as string
    const product = await getProductBySlug(slug);
    res.render("StorePage/homepage/product",{
        product : product,
    });
}



export { getHomePage, getProductPage }