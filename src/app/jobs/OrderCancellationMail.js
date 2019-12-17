import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class OrderCancellationMail {
  get key() {
    return 'OrderCancellationMail';
  }

  async handle({ data }) {
    const { orderDetails } = data;
    const orderDate = format(parseISO(orderDetails.orderDate), 'PPPpp', {
      locale: ptBR,
    });

    await Mail.sendMail({
      to: `${orderDetails.user.name} <${orderDetails.user.email}>`,
      subject: 'Compra cancelada',
      template: 'orderCancellation',
      context: {
        orderDate,
        orderNumber: orderDetails.orderNumber,
      },
    });
  }
}

export default new OrderCancellationMail();
