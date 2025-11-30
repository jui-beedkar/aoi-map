# AOI Map Creator

Single-page React + TypeScript application for creating and managing Areas of Interest (AOIs) on top of a WMS satellite imagery layer.

## Tech Stack

- React + TypeScript + Vite - Core frontend + build setup
- Tailwind CSS - UI styling + layout
- Leaflet + react-leaflet - WMS mapping + overlay
- Playwright - End-to-End automated testing

---

## Map Library Choice

I chose **Leaflet + react-leaflet** because:

- It is Very mature ecosystem with good **WMS support** out of the box.
- It has Easy React integration via `react-leaflet` with declarative    components.
- It is Lightweight and well-suited for 2D web maps without requiring WebGL.

Alternatives considered:

- **MapLibre GL** – great for vector tiles and WebGL performance, but more setup for WMS and overkill for a single-layer satellite viewer.
- **OpenLayers** – powerful and flexible, but higher learning curve and more verbose API.
- **react-map-gl** – optimized for Mapbox-style vector maps; less ideal for this WMS-focused use case.

---


## Architecture

High-level structure:

- `src/main.tsx` – React root, Tailwind + Leaflet CSS imports.
- `src/App.tsx` – Page layout, global AOI state, passes props to children.
- `src/components/Header.tsx` – Top bar / app title.
- `src/components/Sidebar.tsx` – List of AOIs, handles AOI selection.
- `src/components/RightPanel.tsx` – Shows details for currently selected AOI.
- `src/components/MapPanel.tsx` – Leaflet map, WMS layer, keeps view synced with selected AOI.

State:

- `App.tsx` stores:
  - `aois`: static list of AOIs (id, name, description, center, zoom).
  - `selectedAoiId`: currently active AOI.
- `Sidebar` updates `selectedAoiId`.
- `RightPanel` and `MapPanel` receive the selected AOI as props.

---

## Data Model / Schema (ER Overview)

Conceptual entities (future backend):

### AOI

| Field       | Type           | Description                          |
|------------|----------------|--------------------------------------|
| id         | string         | Unique AOI id                        |
| name       | string         | Human-readable name                  |
| description| string         | Text description                     |
| center     | [number,number]| Map center (`[lat, lng]`)           |
| zoom       | number         | Preferred zoom level                 |

### Layer

| Field   | Type   | Description                     |
|---------|--------|---------------------------------|
| id      | string | Unique id                      |
| name    | string | Display name                   |
| type    | string | e.g. `"wms"`, `"vector"`       |
| visible | boolean| Whether layer is currently on  |

### Feature (for drawn geometries, future)

| Field      | Type     | Description                    |
|------------|----------|--------------------------------|
| id         | string   | Unique id                      |
| aoiId      | string   | AOI this feature belongs to    |
| geometry   | GeoJSON  | Point / LineString / Polygon   |
| createdAt  | Date     | Creation timestamp             |

---

## Application UI Preview
![UI Screenshot1](./screenshots/map1.png)
![UI Screenshot2](./screenshots/map2.png)
![UI Screenshot3](./screenshots/map3.png)


## AOI Selection + Map Movement
![AOI Interaction](./screenshots/map4.png)

## ✔ Playwright Test Results
![Tests Passed](./screenshots/ss5.png)

## Video Links- 
The demo video is recorded at a slightly faster pace due to the time window available.
Ui explaination- https://www.loom.com/share/90233044f64847bc9e51e62b67e985d3
Testing implementation- https://www.loom.com/share/56d95e43e39243ebae1ee042dff454ce

## Performance Strategy

**Scaling Feature**                        **Status**
Debounced move events	               reduces unnecessary map refresh load
On-demand layer toggling	           avoids continuous rendering
Clustering for 1000+ markers	       ready for upgrade
Vector tiles as future layer source	 documented roadmap

## API Documentation (future/backend design)

The current version uses static in-memory data, but it is structured to align with a future REST API.

Example routes:

### `GET /api/aois`

Returns the list of AOIs.

```json
[
  {
    "id": "aoi-1",
    "name": "AOI 1",
    "description": "Urban area – test AOI near city center.",
    "center": [51.5, 7.5],
    "zoom": 11
  }
]
