import { isBefore, parseISO } from 'date-fns';

import Cache from '../lib/Cache';

import Product from '../app/models/Product';
import Offer from '../app/models/Offer';
import File from '../app/models/File';
import Category from '../app/models/Category';

class FormatProductService {
  async run(data = null) {
    let products;

    if (data) {
      products = data;
    } else {
      products = await Product.findAll({
        attributes: ['id', 'name', 'description', 'quantity', 'unit', 'price'],
        include: [
          {
            model: File,
            as: 'image',
            attributes: ['path', 'url'],
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });
    }

    let offers;

    const cachedOffers = await Cache.get('offers');

    if (cachedOffers) {
      offers = cachedOffers;
    } else {
      offers = await Offer.findAll({
        attributes: [
          'id',
          'product_id',
          'quantity',
          'unit',
          'from',
          'to',
          'expiration_date',
        ],
        include: [
          {
            model: Product,
            as: 'product',
            attributes: [
              'id',
              'name',
              'description',
              'price',
              'unit',
              'quantity',
            ],
            include: [
              {
                model: File,
                as: 'image',
                attributes: ['path', 'url'],
              },
              {
                model: Category,
                as: 'category',
                attributes: ['name'],
              },
            ],
          },
        ],
      });
    }

    const productsArray = JSON.parse(JSON.stringify(products));

    const offersArray = JSON.parse(JSON.stringify(offers)).filter(
      offer => !isBefore(parseISO(offer.expiration_date), new Date()),
    );

    let productsFormatted;

    if (Array.isArray(productsArray)) {
      productsFormatted = productsArray.map(product => ({
        ...product,
        promo_price:
          (offersArray.find(offer => offer.product.id === product.id) || {})
            .to || false,
      }));
    } else {
      productsFormatted = {
        ...productsArray,
        promo_price:
          (
            offersArray.find(offer => offer.product.id === productsArray.id) ||
            {}
          ).to || false,
      };
    }

    return productsFormatted;
  }
}

export default new FormatProductService();
