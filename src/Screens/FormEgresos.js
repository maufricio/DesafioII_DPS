import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import '../Dise/FormEgresos.css';

// Esquema de validación con Yup
const EgresoSchema = Yup.object().shape({
  tipoEgreso: Yup.string()
    .oneOf([
      'Alquiler/Hipoteca', 
      'Canasta Básica', 
      'Financiamientos', 
      'Transporte', 
      'Servicios públicos', 
      'Salud y Seguro', 
      'Egresos Varios'
    ])
    .required('El tipo de egreso es obligatorio'),
  monto: Yup.number()
    .positive('El monto debe ser un número positivo')
    .required('El monto es obligatorio'),
});

export default function Egresos() {
  const [egresos, setEgresos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedEgresos = JSON.parse(localStorage.getItem('egresos')) || [];
    setEgresos(storedEgresos);
  }, []);

  useEffect(() => {
    localStorage.setItem('egresos', JSON.stringify(egresos));
  }, [egresos]);

  const handleSubmit = (values, { resetForm }) => {
    if (editIndex !== null) {
      const updatedEgresos = [...egresos];
      updatedEgresos[editIndex] = values;
      setEgresos(updatedEgresos);
      setEditIndex(null);
    } else {
      setEgresos([...egresos, values]);
    }
    resetForm();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedEgresos = egresos.filter((_, i) => i !== index);
    setEgresos(updatedEgresos);
  };

  return (
    <Container fluid>
      <Row>
        <Col xs={3} className="sidebar">
          <h2>Lista de Egresos</h2>
          <ListGroup>
            {egresos.map((egreso, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <span>{egreso.tipoEgreso} - ${egreso.monto}</span>
                <div>
                  <Button variant="warning" onClick={() => handleEdit(index)} className="me-2">Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(index)}>Eliminar</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col xs={9}>
          <h2>Formulario de Egresos</h2>
          <Formik
            initialValues={{
              tipoEgreso: editIndex !== null ? egresos[editIndex].tipoEgreso : '',
              monto: editIndex !== null ? egresos[editIndex].monto : ''
            }}
            validationSchema={EgresoSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="form-content">
                <div className="form-group">
                  <label className="form-label">Tipo de Egreso</label>
                  <Field as="select" name="tipoEgreso" className="form-select">
                    <option value="">Selecciona un tipo de egreso</option>
                    <option value="Alquiler/Hipoteca">Alquiler/Hipoteca</option>
                    <option value="Canasta Básica">Canasta Básica</option>
                    <option value="Financiamientos">Financiamientos (Préstamos fuera de hipoteca)</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Servicios públicos">Servicios públicos</option>
                    <option value="Salud y Seguro">Salud y Seguro</option>
                    <option value="Egresos Varios">Egresos Varios</option>
                  </Field>
                  <ErrorMessage name="tipoEgreso" component="div" className="form-error" />
                </div>

                <div className="form-group">
                  <label className="form-label">Monto</label>
                  <Field type="number" name="monto" className="form-input" />
                  <ErrorMessage name="monto" component="div" className="form-error" />
                </div>

                <button type="submit" className="form-button">
                  {editIndex !== null ? 'Actualizar' : 'Agregar'}
                </button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}
