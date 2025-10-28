import { Injectable } from '@nestjs/common';
import { OcorrenciasService } from '../ocorrencias/ocorrencias.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class RelatoriosService {
  constructor(private ocorrenciasService: OcorrenciasService) {}

  async gerarInformativoPDF(ocorrenciaIds: string[]): Promise<Buffer> {
    try {
      console.log('Iniciando geração de PDF para ocorrências:', ocorrenciaIds);
      
      // Buscar dados das ocorrências
      const ocorrencias = await this.ocorrenciasService.findByIds(ocorrenciaIds);
      console.log('Ocorrências encontradas:', ocorrencias.length);
      
      if (ocorrencias.length === 0) {
        throw new Error('Nenhuma ocorrência encontrada');
      }

      // Gerar HTML do relatório
      const html = this.gerarHTMLRelatorio(ocorrencias);
      console.log('HTML gerado com sucesso');

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
      console.log('Browser Puppeteer iniciado');

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      console.log('Conteúdo HTML carregado na página');

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
      console.log('PDF gerado com sucesso');

      await browser.close();
      console.log('Browser fechado');
      
      return pdf;
    } catch (error) {
      console.error('Erro detalhado na geração de PDF:', error);
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
        <title>INFORMATIVO - INFORMAÇÕES RELEVANTES</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .org-line {
            font-size: 14px;
            font-weight: bold;
          }
          .title {
            margin-top: 16px;
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
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
            background-color: #1f2937;
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
          <div class="org-line">POLICIA MILITAR DO ESTADO DA BAHIA</div>
          <div class="org-line">COMANDO DE OPERAÇÕES POLICIAIS MILITARES</div>
          <div class="org-line">COORDENAÇÃO DE INTELIGÊNCIA</div>
          <div class="title">INFORMATIVO - INFORMAÇÕES RELEVANTES</div>
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

            ${ocorrencia.cidade || ocorrencia.estado ? `
              <div class="field">
                <span class="field-label">Cidade/UF:</span>
                <span class="field-value">${[ocorrencia.cidade, ocorrencia.estado].filter(Boolean).join(' / ')}</span>
              </div>
            ` : ''}

            ${ocorrencia.cep ? `
              <div class="field">
                <span class="field-label">CEP:</span>
                <span class="field-value">${ocorrencia.cep}</span>
              </div>
            ` : ''}

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

            ${ocorrencia.latitude && ocorrencia.longitude ? `
              <div class="field">
                <span class="field-label">Coordenadas:</span>
                <span class="field-value">${ocorrencia.latitude}, ${ocorrencia.longitude}</span>
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

            ${ocorrencia.tipo === 'Informação Relevante' ? `
              ${ocorrencia.fonte_informacao ? `
                <div class="field">
                  <span class="field-label">Fonte da Informação:</span>
                  <span class="field-value">${ocorrencia.fonte_informacao}</span>
                </div>
              ` : ''}
              
              ${ocorrencia.nome_fonte ? `
                <div class="field">
                  <span class="field-label">Nome da Fonte:</span>
                  <span class="field-value">${ocorrencia.nome_fonte}</span>
                </div>
              ` : ''}
              
              ${ocorrencia.data_publicacao ? `
                <div class="field">
                  <span class="field-label">Data da Publicação:</span>
                  <span class="field-value">${new Date(ocorrencia.data_publicacao).toLocaleDateString('pt-BR')}</span>
                </div>
              ` : ''}
              
              ${ocorrencia.link_materia ? `
                <div class="field">
                  <span class="field-label">Link da Matéria:</span>
                  <span class="field-value">${ocorrencia.link_materia}</span>
                </div>
              ` : ''}
              
              ${ocorrencia.resumo_informacao ? `
                <div class="field">
                  <span class="field-label">Resumo da Informação:</span>
                  <span class="field-value">${ocorrencia.resumo_informacao}</span>
                </div>
              ` : ''}
              
              ${ocorrencia.relevancia_seguranca ? `
                <div class="field">
                  <span class="field-label">Relevância para Segurança Pública:</span>
                  <span class="field-value">${ocorrencia.relevancia_seguranca}</span>
                </div>
              ` : ''}
              
              ${ocorrencia.observacoes_informacao ? `
                <div class="field">
                  <span class="field-label">Observações da Informação:</span>
                  <span class="field-value">${ocorrencia.observacoes_informacao}</span>
                </div>
              ` : ''}
            ` : ''}
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
