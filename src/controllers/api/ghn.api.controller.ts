import { Request, Response } from 'express';

const GHN_TOKEN = process.env.GHN_TOKEN || '';

const getProvinces = async (req: Request, res: Response) => {
    try {
        const response = await fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': GHN_TOKEN
            }
        });
        const data = await response.json();

        // Lọc bỏ tỉnh test / không hợp lệ, sắp xếp theo tên
        if (data.data && Array.isArray(data.data)) {
            data.data = data.data
                .filter((p: any) =>
                    p.Status === 1 &&
                    !p.ProvinceName.toLowerCase().includes('test') &&
                    !p.ProvinceName.toLowerCase().includes('alert')
                )
                .sort((a: any, b: any) => a.ProvinceName.localeCompare(b.ProvinceName, 'vi'));
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching provinces:', error);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

const getDistricts = async (req: Request, res: Response) => {
    try {
        const province_id = req.query.province_id || req.body.province_id;

        const fetchOptions: any = {
            method: req.method === 'POST' ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': GHN_TOKEN
            }
        };

        let url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district';

        if (province_id) {
            if (fetchOptions.method === 'GET') {
                url += `?province_id=${province_id}`;
            } else {
                fetchOptions.body = JSON.stringify({ province_id: parseInt(province_id as string, 10) });
            }
        }

        const response = await fetch(url, fetchOptions);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching districts:', error);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

const getWards = async (req: Request, res: Response) => {
    try {
        const district_id = req.query.district_id || req.body.district_id;

        const fetchOptions: any = {
            method: req.method === 'POST' ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': GHN_TOKEN
            }
        };

        let url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`;
        if (district_id) {
            if (fetchOptions.method === 'GET') {
                url += `?district_id=${district_id}`;
            } else {
                fetchOptions.body = JSON.stringify({ district_id: parseInt(district_id as string, 10) });
            }
        }

        const response = await fetch(url, fetchOptions);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching wards:', error);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

const getShippingFee = async (req: Request, res: Response) => {
    try {
        const SHOP_ID = process.env.GHN_SHOP_ID;
        const { to_district_id, to_ward_code, service_type_id, weight, length, width, height, insurance_value } = req.body;

        const payload = {
            service_type_id: service_type_id ? parseInt(service_type_id as string, 10) : 2,
            to_district_id: parseInt(to_district_id as string, 10),
            to_ward_code: to_ward_code,
            length: parseInt(length as string, 10) || 30,
            width: parseInt(width as string, 10) || 40,
            height: parseInt(height as string, 10) || 20,
            weight: parseInt(weight as string, 10) || 3000,
            insurance_value: parseInt(insurance_value as string, 10) || 0,
            coupon: null,
            items: [
                {
                    "name": "TEST1",
                    "quantity": 1,
                    "length": 200,
                    "width": 200,
                    "height": 200,
                    "weight": 1000
                }
            ]
        };

        const response = await fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': GHN_TOKEN,
                'ShopId': SHOP_ID || '885'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error calculating shipping fee:', error);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

const createShippingOrder = async (req: Request, res: Response) => {
    try {
        const SHOP_ID = process.env.GHN_SHOP_ID || '885';
        
        // Extract required fields from request body, providing defaults if necessary
        const {
            to_name,
            to_phone,
            to_address,
            to_ward_name,
            to_district_name,
            to_province_name,
            service_type_id,
            required_note,
            length,
            width,
            height,
            weight,
            payment_type_id,
            items
        } = req.body;

        const payload = {
            to_name,
            to_phone,
            to_address,
            to_ward_name,
            to_district_name,
            to_province_name,
            service_type_id: service_type_id || 2,
            required_note: required_note || "KHONGCHOXEMHANG",
            length: length || 40,
            width: width || 20,
            height: height || 30,
            weight: weight || 1000,
            payment_type_id: payment_type_id || 2,
            items: items || []
        };

        const response = await fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': GHN_TOKEN,
                'ShopId': SHOP_ID
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error creating shipping order:', error);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

export {
    getProvinces,
    getDistricts,
    getWards,
    getShippingFee,
    createShippingOrder
}