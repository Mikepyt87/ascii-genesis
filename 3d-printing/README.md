# Printed screen and Pi enclosure

Models designed and supplied by Mikepyt87 for the ASCII Genesis screen and Raspberry Pi setup.

| Part | Original 3MF | STL preview and download | Quantity |
| --- | --- | --- | --- |
| Case | [Case.3mf](Case.3mf) | [Case.stl](Case.stl) | 1 |
| Leg | [Legs(x2).3mf](Legs%28x2%29.3mf) | [Legs(x2).stl](Legs%28x2%29.stl) | Print 2 copies |

The legs file contains one connected model. The x2 in the filename indicates the required print quantity; the STL preserves the original geometry rather than duplicating it.

## Format and scale

The original 3MF files are included unchanged. The binary STL versions preserve their mesh geometry, coordinates, and orientation. STL does not carry units or colors: import these files as **millimeters**, at **100% scale**. Choose a suitable bed orientation in your slicer; the export retains the CAD orientation and is not automatically placed on the print bed.

| Export | X extent | Y extent | Z extent | Triangles |
| --- | --- | --- | --- | --- |
| Case.stl | 211.683 mm | 18.800 mm | 74.000 mm | 5,680 |
| Legs(x2).stl | 65.106 mm | 10.000 mm | 52.226 mm | 2,166 |

These are bounding-box dimensions along the original CAD axes, not a recommended print orientation. Every STL triangle was compared with the source 3MF; coordinate differences are under 0.0001 mm due to STL float precision. This checks conversion accuracy, not physical fit or print settings.

Open an STL link above to use GitHub's interactive model viewer, or download either format into your slicer. GitHub documents previews for [STL files](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#3d-file-viewer).

Filament, layer height, infill, supports, and assembly hardware are not specified in these supplied models. Select those settings for your printer and assembly.
