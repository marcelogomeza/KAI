import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document } from '../types';

export const HierarchyPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/documents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents', error);
        }
    };

    const levels = [
        {
            level: 1,
            name: 'Mapa de procesos',
            title: 'Mapa de Procesos',
            subtitle: 'Define QUÉ hace la empresa y cómo se agrupan las actividades. Es el punto de partida: sin el mapa de procesos no hay contexto para ningún otro documento.',
            meta: ['Se carga 1 vez', 'Actualización anual', 'Aprueba: Gerencia General', 'Código: MAP-XXX'],
            who: 'Líder KAI / CEO',
            colorClass: 'l1',
        },
        {
            level: 2,
            name: 'Políticas',
            title: 'Políticas',
            subtitle: 'Define los PRINCIPIOS y REGLAS que rigen cada proceso. Son el "qué se debe y no se debe hacer".',
            meta: ['1 política por proceso core', 'Revisión anual obligatoria', 'Aprueba: Gerencia del área', 'Código: POL-XXX'],
            who: 'Gerente de área',
            colorClass: 'l2',
        },
        {
            level: 3,
            name: 'Manuales',
            title: 'Manuales',
            subtitle: 'Documentos que describen el FUNCIONAMIENTO INTEGRAL de un proceso o sistema de varios procedimientos relacionados.',
            meta: ['Proceso completo end-to-end', 'Revisión semestral', 'Aprueba: Gerencia + COO/CEO', 'Código: MAN-XXX'],
            who: 'Gerente de área',
            colorClass: 'l3',
        },
        {
            level: 4,
            name: 'Procedimientos',
            title: 'Procedimientos',
            subtitle: 'Describen PASO A PASO cómo ejecutar una actividad específica: quién, qué, cuándo, con qué sistema y en cuánto tiempo.',
            meta: ['6 meses máximo sin revisión', 'Control de versiones obligatorio', 'Aprueba: Coord. + Gerente área', 'Código: PRO-XXX'],
            who: 'Coordinador / Analista',
            colorClass: 'l4',
        },
        {
            level: 5,
            name: 'Guías e Instructivos',
            title: 'Guías e Instructivos',
            subtitle: 'Documentos OPERATIVOS detallados dirigidos al ejecutor en campo. Mientras el procedimiento dice qué hacer, el instructivo dice exactamente CÓMO hacerlo.',
            meta: ['Nivel operario / usuario final', 'Actualizar cada vez que cambie el sistema', 'Aprueba: Coordinador', 'Código: INS-XXX / GUI-XXX'],
            who: 'Coordinador / Auxiliar senior',
            colorClass: 'l5',
        },
        {
            level: 6,
            name: 'Formatos y Registros',
            title: 'Formatos y Registros',
            subtitle: 'Plantillas estandarizadas que se diligencian CADA VEZ que se ejecuta una actividad. Son la evidencia de que el proceso se realizó.',
            meta: ['Plantillas descargables', 'Vigencia controlada', 'Aprueba: Coordinador', 'Código: F-XXX'],
            who: 'Coordinador',
            colorClass: 'l6',
        },
        {
            level: 7,
            name: "Indicadores y Tableros (KPI's)",
            title: 'Indicadores y Tableros (KPIs)',
            subtitle: 'Definen CÓMO SE MIDE cada proceso. Las tarjetas de KPIs formalizan las métricas, metas, semáforos y rutinas de gestión.',
            meta: ['1 tarjeta KPI por proceso', 'Revisión trimestral de metas', 'Aprueba: Gerente de área', 'Código: KPI-XXX'],
            who: 'Gerente de área',
            colorClass: 'l7',
        }
    ];

    return (
        <div className="hierarchy-container" style={{
            '--bg': '#ffffff',
            '--surface': '#f8fafc',
            '--surface2': '#f1f5f9',
            '--border': '#e2e8f0',
            '--border2': '#cbd5e1',
            '--text': '#0f172a',
            '--muted': '#64748b',
            '--muted2': '#475569',
            '--l1': '#f59e0b', '--l1bg': '#fffbeb', '--l1b': '#fcd34d',
            '--l2': '#3b82f6', '--l2bg': '#eff6ff', '--l2b': '#93c5fd',
            '--l3': '#10b981', '--l3bg': '#ecfdf5', '--l3b': '#6ee7b7',
            '--l4': '#8b5cf6', '--l4bg': '#f5f3ff', '--l4b': '#c4b5fd',
            '--l5': '#06b6d4', '--l5bg': '#ecfeff', '--l5b': '#67e8f9',
            '--l6': '#f43f5e', '--l6bg': '#fff1f2', '--l6b': '#fda4af',
            '--l7': '#84cc16', '--l7bg': '#f7fee7', '--l7b': '#bef264',
        } as any}>
            <style dangerouslySetInnerHTML={{
                __html: `
        .hierarchy-container {
            font-family: inherit;
            color: var(--text);
            max-width: 1400px;
            margin: 0 auto;
        }

        .section-label {
            font-size: 11px; font-weight: 700;
            letter-spacing: 4px; text-transform: uppercase;
            color: var(--muted); padding: 40px 0 16px;
            display: flex; align-items: center; gap: 12px;
        }
        .section-label::after {
            content: ''; flex: 1; height: 1px; background: var(--border);
        }

        .hierarchy { display: flex; flex-direction: column; gap: 0; position: relative; }
        .hierarchy::before {
            content: ''; position: absolute; left: 28px; top: 0; bottom: 0; width: 2px;
            background: linear-gradient(180deg, var(--l1) 0%, var(--l2) 14%, var(--l3) 28%, var(--l4) 42%, var(--l5) 56%, var(--l6) 70%, var(--l7) 84%, transparent 100%);
            opacity: 0.4;
        }

        .level { display: flex; flex-direction: column; position: relative; padding-left: 72px; padding-bottom: 8px; }
        .level-dot {
            position: absolute; left: 18px; top: 28px; width: 22px; height: 22px;
            border-radius: 50%; border: 2px solid; display: flex; align-items: center; justify-content: center;
            font-size: 10px; font-weight: 900; z-index: 2; background: white;
        }
        .level::after {
            content: ''; position: absolute; left: 40px; top: 38px; width: 24px; height: 1px; opacity: 0.5;
        }

        .level-header {
            display: flex; align-items: flex-start; gap: 16px; padding: 24px 28px;
            border-radius: 12px; border: 1px solid; margin-bottom: 12px; position: relative; transition: transform 0.2s ease;
        }
        .level-header:hover { transform: translateX(4px); }

        .level-number {
            font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
            padding: 4px 10px; border-radius: 4px; flex-shrink: 0; margin-top: 2px;
        }
        .level-content { flex: 1; }
        .level-title { font-size: 20px; font-weight: 800; line-height: 1.2; margin-bottom: 4px; }
        .level-subtitle { font-size: 13px; color: var(--muted2); margin-bottom: 10px; line-height: 1.5; }
        .level-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .tag { font-size: 11px; padding: 3px 10px; border-radius: 4px; font-weight: 600; letter-spacing: 0.3px; border: 1px solid; }

        .level-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; min-width: 120px; }
        .step-badge { font-size: 22px; font-weight: 900; opacity: 0.15; }
        .who-badge { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); text-align: right; }

        .sub-items { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; margin-left: 16px; margin-bottom: 16px; }
        .sub-item { padding: 14px 16px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); position: relative; transition: border-color 0.2s, transform 0.2s; }
        .sub-item:hover { transform: translateY(-2px); }
        .sub-item-code { font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
        .sub-item-name { font-size: 13px; color: var(--text); line-height: 1.4; margin-bottom: 8px; font-weight: 500; }
        .sub-item-tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .mini-tag { font-size: 10px; padding: 2px 7px; border-radius: 3px; font-weight: 500; background: var(--surface2); color: var(--muted2); border: 1px solid var(--border); }

        .sub-connector { position: relative; padding-left: 20px; margin-bottom: 20px; }
        .sub-connector::before { content: ''; position: absolute; left: 0; top: 10px; width: 14px; height: 1px; opacity: 0.3; }
        .sub-connector::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; opacity: 0.15; }

        .l1 .level-header { background: var(--l1bg); border-color: var(--l1b); }
        .l1 .level-dot { border-color: var(--l1); color: var(--l1); }
        .l1 .level-title { color: var(--l1); }
        .l1 .level-number { background: rgba(245,158,11,0.12); color: var(--l1); border: 1px solid var(--l1b); }
        .l1 .tag { background: rgba(245,158,11,0.08); color: var(--l1); border-color: var(--l1b); }
        .l1 .step-badge { color: var(--l1); }
        .l1::after { background: var(--l1); }
        .l1 .sub-connector::before, .l1 .sub-connector::after { background: var(--l1); }
        .l1 .sub-item-code { color: var(--l1); }
        .l1 .sub-item:hover { border-color: var(--l1b); }

        .l2 .level-header { background: var(--l2bg); border-color: var(--l2b); }
        .l2 .level-dot { border-color: var(--l2); color: var(--l2); }
        .l2 .level-title { color: var(--l2); }
        .l2 .level-number { background: rgba(59,130,246,0.12); color: var(--l2); border: 1px solid var(--l2b); }
        .l2 .tag { background: rgba(59,130,246,0.08); color: var(--l2); border-color: var(--l2b); }
        .l2 .step-badge { color: var(--l2); }
        .l2::after { background: var(--l2); }
        .l2 .sub-connector::before, .l2 .sub-connector::after { background: var(--l2); }
        .l2 .sub-item-code { color: var(--l2); }
        .l2 .sub-item:hover { border-color: var(--l2b); }

        .l3 .level-header { background: var(--l3bg); border-color: var(--l3b); }
        .l3 .level-dot { border-color: var(--l3); color: var(--l3); }
        .l3 .level-title { color: var(--l3); }
        .l3 .level-number { background: rgba(16,185,129,0.12); color: var(--l3); border: 1px solid var(--l3b); }
        .l3 .tag { background: rgba(16,185,129,0.08); color: var(--l3); border-color: var(--l3b); }
        .l3 .step-badge { color: var(--l3); }
        .l3::after { background: var(--l3); }
        .l3 .sub-connector::before, .l3 .sub-connector::after { background: var(--l3); }
        .l3 .sub-item-code { color: var(--l3); }
        .l3 .sub-item:hover { border-color: var(--l3b); }

        .l4 .level-header { background: var(--l4bg); border-color: var(--l4b); }
        .l4 .level-dot { border-color: var(--l4); color: var(--l4); }
        .l4 .level-title { color: var(--l4); }
        .l4 .level-number { background: rgba(139,92,246,0.12); color: var(--l4); border: 1px solid var(--l4b); }
        .l4 .tag { background: rgba(139,92,246,0.08); color: var(--l4); border-color: var(--l4b); }
        .l4 .step-badge { color: var(--l4); }
        .l4::after { background: var(--l4); }
        .l4 .sub-connector::before, .l4 .sub-connector::after { background: var(--l4); }
        .l4 .sub-item-code { color: var(--l4); }
        .l4 .sub-item:hover { border-color: var(--l4b); }

        .l5 .level-header { background: var(--l5bg); border-color: var(--l5b); }
        .l5 .level-dot { border-color: var(--l5); color: var(--l5); }
        .l5 .level-title { color: var(--l5); }
        .l5 .level-number { background: rgba(6,182,212,0.12); color: var(--l5); border: 1px solid var(--l5b); }
        .l5 .tag { background: rgba(6,182,212,0.08); color: var(--l5); border-color: var(--l5b); }
        .l5 .step-badge { color: var(--l5); }
        .l5::after { background: var(--l5); }
        .l5 .sub-connector::before, .l5 .sub-connector::after { background: var(--l5); }
        .l5 .sub-item-code { color: var(--l5); }
        .l5 .sub-item:hover { border-color: var(--l5b); }

        .l6 .level-header { background: var(--l6bg); border-color: var(--l6b); }
        .l6 .level-dot { border-color: var(--l6); color: var(--l6); }
        .l6 .level-title { color: var(--l6); }
        .l6 .level-number { background: rgba(244,63,94,0.12); color: var(--l6); border: 1px solid var(--l6b); }
        .l6 .tag { background: rgba(244,63,94,0.08); color: var(--l6); border-color: var(--l6b); }
        .l6 .step-badge { color: var(--l6); }
        .l6::after { background: var(--l6); }
        .l6 .sub-connector::before, .l6 .sub-connector::after { background: var(--l6); }
        .l6 .sub-item-code { color: var(--l6); }
        .l6 .sub-item:hover { border-color: var(--l6b); }

        .l7 .level-header { background: var(--l7bg); border-color: var(--l7b); }
        .l7 .level-dot { border-color: var(--l7); color: var(--l7); }
        .l7 .level-title { color: var(--l7); }
        .l7 .level-number { background: rgba(132,204,22,0.12); color: var(--l7); border: 1px solid var(--l7b); }
        .l7 .tag { background: rgba(132,204,22,0.08); color: var(--l7); border-color: var(--l7b); }
        .l7 .step-badge { color: var(--l7); }
        .l7::after { background: var(--l7); }
        .l7 .sub-connector::before, .l7 .sub-connector::after { background: var(--l7); }
        .l7 .sub-item-code { color: var(--l7); }
        .l7 .sub-item:hover { border-color: var(--l7b); }
        
        .flow-arrow { display: flex; align-items: center; justify-content: center; padding: 4px 0 4px 72px; color: var(--muted); font-size: 20px; opacity: 0.4; }
      `}} />

            <div>
                <h1 className="text-3xl font-bold mb-2">Jerarquía Documental</h1>
                <p className="text-gray-500 mb-8">Mapa del orden en que deben crearse y registrarse los documentos en KAI. Cada nivel depende del anterior.</p>
            </div>

            <div className="section-label">Estructura jerárquica — de mayor a menor abstracción</div>

            <div className="hierarchy">
                {levels.map((lvl, index) => {
                    const docs = documents.filter(d => (d.type || '').trim().toLowerCase() === lvl.name.toLowerCase());

                    return (
                        <React.Fragment key={lvl.level}>
                            <div className={`level ${lvl.colorClass}`}>
                                <div className="level-dot">{lvl.level}</div>
                                <div className="level-header">
                                    <div className="level-number">Nivel {lvl.level}</div>
                                    <div className="level-content">
                                        <div className="level-title">{lvl.title}</div>
                                        <div className="level-subtitle">{lvl.subtitle}</div>
                                        <div className="level-meta">
                                            {lvl.meta.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                        </div>
                                    </div>
                                    <div className="level-right">
                                        <div className="step-badge">0{lvl.level}</div>
                                        <div className="who-badge">Quién carga:<br />{lvl.who}</div>
                                    </div>
                                </div>

                                {docs.length > 0 && (
                                    <div className={`sub-connector ${lvl.colorClass}`}>
                                        <div className="sub-items">
                                            {docs.map(doc => (
                                                <div key={doc.id} className="sub-item">
                                                    <div className="sub-item-code">{doc.code || doc.type}</div>
                                                    <div className="sub-item-name">{doc.name}</div>
                                                    <div className="sub-item-tags">
                                                        {doc.area && <span className="mini-tag">{doc.area}</span>}
                                                        {doc.linkedProcess && <span className="mini-tag">{doc.linkedProcess}</span>}
                                                        {doc.confidentiality && <span className="mini-tag">{doc.confidentiality}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {index < levels.length - 1 && <div className="flow-arrow">↓</div>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
