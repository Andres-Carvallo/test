'use client';

interface Order {
  customer: {
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    commune: {
      name: string;
      region: {
        name: string;
        country: {
          name: string;
        };
      };
    };
  };
  shippingInfo: {
    addressLine1: string;
    addressLine2?: string;
    commune: {
      name: string;
      region: {
        name: string;
        country: {
          name: string;
        };
      };
    };
  };
  totals: {
    itemsAmount: number;
    discountAmount: number;
    shippingAmount: number;
    totalAmount: number;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    sku: {
      mainImageUrl?: string;
      product: {
        name: string;
        previewImageUrl?: string;
      };
      attributes: Array<{
        attributeId: string;
        attributeName: string;
        value: string;
      }>;
    };
  }>;
  deliveryType: {
    code: string;
  };
}

// Datos de ejemplo para la página
const mockOrder: Order = {
  customer: {
    firstname: "Juan",
    lastname: "Pérez",
    phoneNumber: "+56912345678",
    email: "juan.perez@ejemplo.com",
    addressLine1: "Calle Principal 123",
    addressLine2: "Piso 4, Depto 401",
    commune: {
      name: "Santiago",
      region: {
        name: "Región Metropolitana",
        country: {
          name: "Chile"
        }
      }
    }
  },
  shippingInfo: {
    addressLine1: "Calle Principal 123",
    addressLine2: "Piso 4, Depto 401",
    commune: {
      name: "Santiago",
      region: {
        name: "Región Metropolitana",
        country: {
          name: "Chile"
        }
      }
    }
  },
  totals: {
    itemsAmount: 50000,
    discountAmount: 5000,
    shippingAmount: 3000,
    totalAmount: 48000
  },
  items: [
    {
      id: "1",
      quantity: 2,
      unitPrice: 25000,
      sku: {
        mainImageUrl: "https://via.placeholder.com/80",
        product: {
          name: "Producto de Ejemplopruebaprueba prueba",
          previewImageUrl: "https://via.placeholder.com/80"
        },
        attributes: [
          {
            attributeId: "1",
            attributeName: "Color",
            value: "Rojo"
          },
          {
            attributeId: "2",
            attributeName: "Talla",
            value: "M"
          }
        ]
      }
    },
    {
      id: "2",
      quantity: 2,
      unitPrice: 25000,
      sku: {
        mainImageUrl: "https://via.placeholder.com/80",
        product: {
          name: "Producto de Ejemplo",
          previewImageUrl: "https://via.placeholder.com/80"
        },
        attributes: [
          {
            attributeId: "1",
            attributeName: "Color",
            value: "Rojo"
          },
          {
            attributeId: "2",
            attributeName: "Talla",
            value: "M"
          }
        ]
      }
    },

  ],
  deliveryType: {
    code: "DELIVERY"
  }
};

export default function MailPage() {
  const { customer, shippingInfo, totals, items } = mockOrder;

  return (
    <div className="mail-container">
      {/* Header */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#ffffff' }}>
        <tr>
          <td style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
              ¡Hola! {customer?.firstname} {customer?.lastname}
            </h1>
            <p style={{ color: '#4b5563', margin: '0 0 4px 0' }}>¡Gracias por tu compra!</p>
            <p style={{ color: '#4b5563', margin: '0' }}>Prepararemos tu pedido pronto.</p>
          </td>
        </tr>
      </table>

      {/* Detalles del Pedido */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#ffffff' }}>
        <tr>
          <td style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Detalles del Pedido</h2>
            {items?.map((item: any) => (
              <table key={item.id} width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <td style={{ padding: '8px 0' }}>
                    <div className="product-image">
                      <img
                        src={item.sku?.mainImageUrl || item.sku?.product?.previewImageUrl}
                        alt={item.sku?.product?.name}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }}
                      />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>{item.sku?.product?.name}</h3>
                    {item.sku?.attributes && item.sku.attributes.length > 0 && (
                      <ul style={{ margin: '0', paddingLeft: '20px', color: '#4b5563' }}>
                        {item.sku.attributes.map((attribute: any) => (
                          <li key={attribute.attributeId} style={{ marginBottom: '4px' }}>
                            {attribute.attributeName}: <span style={{ fontWeight: '500' }}>{attribute.value}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', textAlign: 'right' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#4b5563' }}>Cantidad: {item.quantity}</p>
                    <p style={{ margin: '0', fontWeight: '600', fontSize: '16px' }}>${item.unitPrice.toLocaleString("es-CL")}</p>
                  </td>
                </tr>
              </table>
            ))}
          </td>
        </tr>
      </table>

      {/* Información del Cliente */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f9fafb' }}>
        <tr>
          <td style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Información del Cliente</h2>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={{ paddingBottom: '12px' }}>
                  <div className="info-label">Nombre:</div>
                  <div className="info-value">{customer?.firstname} {customer?.lastname}</div>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '12px' }}>
                  <div className="info-label">Teléfono:</div>
                  <div className="info-value">{customer?.phoneNumber}</div>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '12px' }}>
                  <div className="info-label">Email:</div>
                  <div className="info-value">{customer?.email}</div>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '12px' }}>
                  <div className="info-label">Dirección:</div>
                  <div className="info-value">{customer?.addressLine1}</div>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '12px' }}>
                  <div className="info-label">Comuna:</div>
                  <div className="info-value">{customer?.commune?.name}, {customer?.commune?.region?.name}</div>
                </td>
              </tr>
              {customer?.addressLine2 && (
                <tr>
                  <td style={{ paddingBottom: '12px' }}>
                    <div className="info-label">Indicaciones:</div>
                    <div className="info-value">{customer?.addressLine2}</div>
                  </td>
                </tr>
              )}
            </table>
          </td>
        </tr>
      </table>

      {/* Totales */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f9fafb' }}>
        <tr>
          <td style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Totales</h2>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={{ paddingBottom: '8px' }}>
                  <span>Monto de Artículos:</span>
                  <span style={{ float: 'right' }}>${totals.itemsAmount.toLocaleString("es-CL")}</span>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '8px' }}>
                  <span>Monto de Descuento:</span>
                  <span style={{ float: 'right' }}>${totals.discountAmount.toLocaleString("es-CL")}</span>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '8px' }}>
                  <span>Monto de Envío:</span>
                  <span style={{ float: 'right' }}>${totals.shippingAmount.toLocaleString("es-CL")}</span>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '8px', borderTop: '1px solid #e5e7eb', fontWeight: 'bold', fontSize: '16px' }}>
                  <span>Monto Total:</span>
                  <span style={{ float: 'right' }}>${totals.totalAmount.toLocaleString("es-CL")}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <style jsx>{`
        .mail-container {
          max-width: 250px;
          margin: 0 auto;
          background-color: #ffffff;
        }

        @media (min-width: 768px) {
          .mail-container {
            max-width: 90%;
          }
        }

        .product-image {
          display: block;
          margin-bottom: 12px;
        }

        .info-label {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .info-value {
          color: #4b5563;
        }

        @media (min-width: 768px) {
          .info-label {
            display: inline-block;
            width: 80px;
            margin-bottom: 0;
          }

          .info-value {
            display: inline-block;
          }
        }
      `}</style>
    </div>
  );
}
