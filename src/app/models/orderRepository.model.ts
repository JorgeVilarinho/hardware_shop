export interface OrderRepository {
  id: number,
  id_cliente: number,
  id_trabajador: number,
  id_metodo_envio: number,
  id_opcion_envio: number,
  id_opcion_pago: number,
  fecha_creacion: Date
}