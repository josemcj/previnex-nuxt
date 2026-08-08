export default function (blobData: BlobPart, fileExtension: string, filename: string = 'archivo'): void {
  const blob = new Blob([blobData]);

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.${fileExtension}`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
