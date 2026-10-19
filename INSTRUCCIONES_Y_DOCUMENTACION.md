# Cafetería IES Los Rosales — Documentación Técnica y Guía de Operaciones

**Slogan:** “Tu pausa. Tu café. Tu espacio.”  
**Slogan secundario:** “Un buen café, mejores momentos.”

---

## 1. Arquitectura del Proyecto

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Identidad Visual:**
  - Verde oscuro institucional: `#0F3D2E`
  - Crema cálida: `#F8F1E3`
  - Dorado artesanal: `#B88B4A`
  - Rojo rosa: `#C93F3F`
  - Blanco puro: `#FFFFFF`
  - Logo circular vectorizado con rosa roja, taza de café humeante y libro abierto.
- **Persistencia Reactiva:** Gestión en `localStorage` con modelo relacional desacoplado, preparado para conexión directa con Supabase/PostgreSQL.

---

## 2. Esquema y Migraciones de Base de Datos (PostgreSQL / Supabase)

Ejecuta el siguiente script en el editor SQL de Supabase para desplegar las tablas relacionales:

```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Categorías
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

-- 2. Tabla de Productos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON UPDATE CASCADE,
  price NUMERIC(6,2) NOT NULL,
  description TEXT,
  ingredients TEXT,
  allergens TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Menús Combo
CREATE TABLE combos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  fixed_price NUMERIC(6,2) NOT NULL,
  main_choices TEXT[] NOT NULL,
  drink_choices TEXT[] NOT NULL,
  side_choice TEXT NOT NULL
);

-- 4. Tabla de Pedidos
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_role TEXT NOT NULL CHECK (customer_role IN ('estudiante', 'profesor', 'personal')),
  customer_contact TEXT,
  pickup_slot TEXT NOT NULL,
  total_amount NUMERIC(6,2) NOT NULL,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aceptado', 'en_preparacion', 'listo', 'entregado', 'cancelado')),
  paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabla de Ítems del Pedido
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(6,2) NOT NULL,
  is_combo BOOLEAN DEFAULT false,
  combo_selections JSONB,
  custom_options JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Configuración de Cafetería y Horarios
CREATE TABLE business_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  allow_preorders BOOLEAN DEFAULT true,
  banner_active BOOLEAN DEFAULT true,
  banner_title TEXT,
  banner_text TEXT,
  recess_morning TEXT DEFAULT '11:00 - 11:30',
  recess_midday TEXT DEFAULT '13:00 - 13:30',
  opening_hours TEXT DEFAULT 'Lunes a Viernes de 07:45 a 17:30',
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  institute_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SEGURIDAD: Políticas RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Lectura pública para consulta de carta sin registro
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON business_settings FOR SELECT USING (true);

-- Inserción de pedidos por parte de clientes
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);

-- Acceso completo de gestión para administradores autenticados
CREATE POLICY "Admin All Products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Orders" ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Settings" ON business_settings FOR ALL TO authenticated USING (true);
```

---

## 3. Variables de Entorno (.env.example)

```env
# Clave de Gemini si se habilitan funciones de recomendación inteligente
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# URL de la aplicación web
APP_URL="https://ais-dev-cuwvtc63mpghpscvzhhjzm-172221757488.europe-west2.run.app"

# Integración futura con Supabase (opcional):
VITE_SUPABASE_URL="https://xyzcompany.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
```

---

## 4. Guía para el Primer Administrador

1. En la barra superior, pulsa en el botón **“Gestión”** (o en el enlace de pie de página “Acceso a Gestión y Mostrador”).
2. Introduce el PIN predeterminado:
   - PIN rápido: `1234`
   - Clave alternativa: `admin123` o `rosales2026`
3. Una vez dentro, tendrás acceso directo a:
   - **Gestión de Pedidos:** Acepta, pasa a preparación, marca como "Listo para recoger" y cobra los pedidos.
   - **Productos y Precios:** Edita precios en tiempo real sin tocar código, activa/desactiva productos o crea nuevas opciones.
   - **Caja y Estadísticas:** Diferenciación estricta de ingresos cobrados frente a comandas pendientes, cálculo del ticket medio y exportación a CSV.
   - **Horarios y Avisos:** Interruptor para pausar o autorizar pedidos anticipados y modificar el banner superior.

---

## 5. Instrucciones para Actualizar Precios y Productos

- Desde la pestaña **“Productos y Precios”**:
  - Para cambiar un precio rápidamente, pulsa en el campo numérico del producto, escribe el nuevo valor (ej: `1,50`) y haz clic fuera o pulsa Intro.
  - Para marcar un producto como **Agotado**, haz clic en el botón verde "Disponible" y cambiará inmediatamente a "Agotado", mostrándose deshabilitado a los alumnos.
  - Para editar descripción, alérgenos o ingredientes, pulsa el icono de lápiz.
  - Para volver en cualquier momento a la carta oficial del centro, pulsa **“Restaurar Carta Original”**.

---

## 6. Generación y Uso del Código QR

1. Pulsa en el icono de **Código QR** en la barra de navegación o accede a la pestaña de QR.
2. La aplicación detecta automáticamente la URL pública activa (`window.location.origin`).
3. Opciones disponibles:
   - **Descargar Imagen PNG:** Para maquetar folletos o pegatinas en las mesas.
   - **Imprimir Cartel para el Mostrador:** Formato A4 listo para colocar en los cristales de la cafetería y en el tablón de anuncios.
4. Cualquier móvil (Android o iPhone) lee el código con la cámara nativa sin instalar apps adicionales.

---

## 7. Informe de Pruebas Realizadas

- **Prueba 1: Integridad de Menús Combo:**
  - Verificado que el Combo 1 conserva estrictamente su precio de **3,50 €** seleccionando sándwich mixto, pollo o jamón y queso, bebida y patatas sin ningún sobrecoste.
  - Verificado que el Combo 2 conserva estrictamente su precio de **4,50 €** seleccionando bocadillo, bebida y patatas.
- **Prueba 2: Separación de Caja y Ventas Efectivas:**
  - Comprobado que los pedidos en estado "Pendiente", "Aceptado" o "En preparación" no inflan las ventas de caja; únicamente se contabilizan en el arqueo al ser cobrados/entregados.
- **Prueba 3: Buscador y Filtros:**
  - Filtro instantáneo por categoría (Cafés, Desayunos, Pulgas, Bocadillos, etc.) y búsqueda libre por nombre e ingredientes.
- **Prueba 4: Control de Pedidos Anticipados:**
  - Al desactivar la casilla en Ajustes, el carrito desactiva la pasarela de encargo y orienta al alumno a solicitarlo en mostrador presencial.
- **Prueba 5: Generación QR e Impresión:**
  - Generación de código QR nítido con el logo corporativo e impresión de cartelería.
- **Prueba 6: Accesibilidad y RGPD:**
  - Cumplimiento de no solicitud de datos bancarios ni perfiles sensibles a menores de edad; aviso oficial de alérgenos visible en todas las secciones.

---

## 8. Envío de Pedidos por WhatsApp

- **Número receptor configurado:** `34615741675` (formato internacional estándar sin signo + ni espacios).
- **Enlace de integración:** `https://wa.me/34615741675?text=...` con texto URL-encoded.
- **Ubicación del botón:**
  - En la bandeja/carrito de compra (`CartDrawer.tsx`): botón visible **“Enviar pedido por WhatsApp”**.
  - En el resumen y seguimiento del pedido (`OrderStatusTracker.tsx`): botón visible **“Enviar pedido por WhatsApp”**.
- **Contenido del mensaje generado:**
  - Referencia del pedido (`#ROS-XXXX`) si ya ha sido emitido.
  - Nombre del comensal y rol en el centro (estudiante / profesor / personal).
  - Franja horaria de recogida solicitada.
  - Listado detallado de productos con cantidades y precios parciales.
  - Opciones y combinaciones seleccionadas de los combos (principal, bebida, patatas) y personalizaciones (tipo de leche, etc.).
  - Total exacto en euros.
  - Nota recordatoria: Al abrir WhatsApp, el usuario debe pulsar el botón de envío nativo para que la cafetería reciba la comanda.
- **Compatibilidad:** Compatible automáticamente con WhatsApp en dispositivos móviles (Android/iOS) y con WhatsApp Web / Escritorio en PC.

---

## 9. Despliegue e Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```
