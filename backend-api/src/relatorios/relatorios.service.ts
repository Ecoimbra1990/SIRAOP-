import { Injectable } from '@nestjs/common';
import { OcorrenciasService } from '../ocorrencias/ocorrencias.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class RelatoriosService {
  constructor(private ocorrenciasService: OcorrenciasService) {}

  async gerarInformativoPDF(ocorrenciaIds: string[]): Promise<Buffer> {
    try {
      // Buscar dados das ocorrências
      const ocorrencias = await this.ocorrenciasService.findByIds(ocorrenciaIds);
      
      if (ocorrencias.length === 0) {
        throw new Error('Nenhuma ocorrência encontrada');
      }

      // Gerar HTML do relatório
      const html = this.gerarHTMLRelatorio(ocorrencias);

      // Configurar Puppeteer para Cloud Run
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Gerar PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      await browser.close();
      return pdf;
    } catch (error) {
      throw new Error(`Erro ao gerar PDF: ${error.message}`);
    }
  }

  private gerarHTMLRelatorio(ocorrencias: any[]): string {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório Informativo - SIRAOP</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #666;
          }
          .info {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .ocorrencia {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #fff;
          }
          .ocorrencia-header {
            background-color: #2563eb;
            color: white;
            padding: 10px;
            margin: -20px -20px 15px -20px;
            border-radius: 8px 8px 0 0;
            font-weight: bold;
          }
          .field {
            margin-bottom: 10px;
          }
          .field-label {
            font-weight: bold;
            color: #374151;
          }
          .field-value {
            margin-left: 10px;
            color: #6b7280;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SIRAOP</div>
          <div class="subtitle">Sistema de Registro e Análise de Ocorrências Policiais</div>
        </div>

        <div class="info">
          <strong>Relatório Informativo</strong><br>
          Gerado em: ${dataAtual} às ${horaAtual}<br>
          Total de ocorrências: ${ocorrencias.length}
        </div>

        ${ocorrencias.map((ocorrencia, index) => `
          <div class="ocorrencia">
            <div class="ocorrencia-header">
              Ocorrência ${index + 1} - ${ocorrencia.tipo}
            </div>
            
            <div class="field">
              <span class="field-label">Data/Hora do Fato:</span>
              <span class="field-value">${new Date(ocorrencia.data_hora_fato).toLocaleString('pt-BR')}</span>
            </div>

            <div class="field">
              <span class="field-label">Endereço:</span>
              <span class="field-value">${ocorrencia.endereco}</span>
            </div>

            ${ocorrencia.bairro ? `
              <div class="field">
                <span class="field-label">Bairro:</span>
                <span class="field-value">${ocorrencia.bairro}</span>
              </div>
            ` : ''}

            ${ocorrencia.opm ? `
              <div class="field">
                <span class="field-label">OPM:</span>
                <span class="field-value">${ocorrencia.opm}</span>
              </div>
            ` : ''}

            ${ocorrencia.numero_bo ? `
              <div class="field">
                <span class="field-label">Número do BO:</span>
                <span class="field-value">${ocorrencia.numero_bo}</span>
              </div>
            ` : ''}

            <div class="field">
              <span class="field-label">Descrição:</span>
              <span class="field-value">${ocorrencia.descricao}</span>
            </div>

            ${ocorrencia.observacoes ? `
              <div class="field">
                <span class="field-label">Observações:</span>
                <span class="field-value">${ocorrencia.observacoes}</span>
              </div>
            ` : ''}

            <div class="field">
              <span class="field-label">Status:</span>
              <span class="field-value">${ocorrencia.status}</span>
            </div>
          </div>
        `).join('')}

        <div class="footer">
          Este relatório foi gerado automaticamente pelo sistema SIRAOP.<br>
          Para mais informações, acesse o sistema ou entre em contato com a administração.
        </div>
      </body>
      </html>
    `;
  }
}
