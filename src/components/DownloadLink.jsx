import React, { useState } from 'react';
import { Text } from 'react-native';
import { getDocumentUrl } from '../services/projectService.js';

const DownloadLink = ({ file, style }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
  if (isLoading) return;
  setIsLoading(true);
  try {
    // 1. Obtenemos la URL segura como antes
    const url = await getDocumentUrl(file.file_path);

    // 2. Descargamos el archivo en la memoria del navegador como un 'blob'
    const response = await fetch(url);
    const blob = await response.blob();

    // 3. Creamos una URL local para ese blob
    const blobUrl = window.URL.createObjectURL(blob);

    // 4. Usamos el truco del enlace, pero con la URL local
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 5. Limpiamos la URL local después de usarla
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error("Download failed:", error);
    alert('Could not download the file.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Text style={style} onPress={handleDownload}>
      {isLoading ? 'Cargando...' : 'Download'}
    </Text>
  );
};

export default DownloadLink;