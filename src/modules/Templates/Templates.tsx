import { useAuth } from '@/components/AuthProvider'
import { useEditorStore } from '@/components/PdfEditor/store'
import type { DragItem } from '@/components/PdfEditor/types'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Loader2, Lock, Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TemplatePreview from './TemplatePreview'

// Template interface
interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category:
    | 'invoice'
    | 'proposal'
    | 'quote'
    | 'contract'
    | 'receipt'
    | 'timesheet'
    | 'resume'
    | 'letter'
    | 'report'
    | 'form'
  elements: DragItem[]
}

// Complete real-world templates
const templates: Template[] = [
  {
    id: 'resume-1',
    name: 'Professional Resume',
    description: 'Complete ATS-friendly resume with all sections',
    thumbnail: '📄',
    category: 'resume',
    elements: [
      {
        id: 'txt-1',
        type: 'text',
        position: { x: 100, y: 50 },
        size: { width: 600, height: 60 },
        rotation: 0,
        color: '#1a1a1a',
        zIndex: 1,
        textContent: 'ALEXANDRA MARTINEZ',
        textStyle: { fontSize: 28, bold: true, align: 'center', color: '#1a1a1a' }
      },
      {
        id: 'txt-2',
        type: 'text',
        position: { x: 100, y: 95 },
        size: { width: 600, height: 30 },
        rotation: 0,
        color: '#555555',
        zIndex: 2,
        textContent: 'alexandra.martinez@email.com | (555) 987-6543 | linkedin.com/in/alexandramartinez',
        textStyle: { fontSize: 11, align: 'center', color: '#555555' }
      },
      {
        id: 'line-1',
        type: 'line',
        position: { x: 100, y: 125 },
        size: { width: 600, height: 1.5 },
        rotation: 0,
        color: '#1a1a1a',
        zIndex: 3,
        lineStyle: { strokeStyle: 'solid', lineWidth: 1.5, color: '#1a1a1a' }
      },
      {
        id: 'txt-3',
        type: 'text',
        position: { x: 100, y: 150 },
        size: { width: 150, height: 25 },
        rotation: 0,
        color: '#1a1a1a',
        zIndex: 4,
        textContent: 'PROFESSIONAL SUMMARY',
        textStyle: { fontSize: 14, bold: true, color: '#1a1a1a' }
      },
      {
        id: 'txt-4',
        type: 'text',
        position: { x: 100, y: 180 },
        size: { width: 600, height: 80 },
        rotation: 0,
        color: '#333333',
        zIndex: 5,
        textContent: 'Experienced software engineer with 8+ years developing scalable web applications and cloud-native solutions. Expertise in full-stack development, CI/CD pipelines, and microservices architecture. Proven track record of leading cross-functional teams and delivering high-impact projects.',
        textStyle: { fontSize: 11, color: '#333333' }
      },
      {
        id: 'txt-5',
        type: 'text',
        position: { x: 100, y: 250 },
        size: { width: 150, height: 25 },
        rotation: 0,
        color: '#1a1a1a',
        zIndex: 6,
        textContent: 'WORK EXPERIENCE',
        textStyle: { fontSize: 14, bold: true, color: '#1a1a1a' }
      },
      {
        id: 'txt-6',
        type: 'text',
        position: { x: 100, y: 285 },
        size: { width: 400, height: 30 },
        rotation: 0,
        color: '#1a1a1a',
        zIndex: 7,
        textContent: 'Senior Software Engineer',
        textStyle: { fontSize: 12, bold: true, color: '#1a1a1a' }
      },
      {
        id: 'txt-7',
        type: 'text',
        position: { x: 500, y: 285 },
        size: { width: 200, height: 30 },
        rotation: 0,
        color: '#555555',
        zIndex: 8,
        textContent: 'Jan 2021 - Present',
        textStyle: { fontSize: 11, align: 'right', color: '#555555' }
      },
      {
        id: 'txt-8',
        type: 'text',
        position: { x: 100, y: 310 },
        size: { width: 600, height: 30 },
        rotation: 0,
        color: '#666666',
        zIndex: 9,
        textContent: 'TechCorp Inc., San Francisco, CA',
        textStyle: { fontSize: 11, italic: true, color: '#666666' }
      },
      {
        id: 'txt-9',
        type: 'text',
        position: { x: 100, y: 340 },
        size: { width: 600, height: 60 },
        rotation: 0,
        color: '#333333',
        zIndex: 10,
        textContent: '• Architected and implemented microservices infrastructure supporting 2M+ daily active users\n• Led team of 5 engineers, establishing agile practices and improving deployment velocity by 40%\n• Developed REST APIs and GraphQL services, reducing API response time by 60%',
        textStyle: { fontSize: 11, color: '#333333' }
      },
      {
        id: 'txt-10',
        type: 'text',
        position: { x: 100, y: 425 },
        size: { width: 400, height: 30 },
        rotation: 0,
        color: '#1a1a1a',
        zIndex: 11,
        textContent: 'Software Engineer',
        textStyle: { fontSize: 12, bold: true, color: '#1a1a1a' }
      },
      {
        id: 'txt-11',
        type: 'text',
        position: { x: 500, y: 425 },
        size: { width: 200, height: 30 },
        rotation: 0,
        color: '#555555',
        zIndex: 12,
        textContent: 'Jun 2018 - Dec 2020',
        textStyle: { fontSize: 11, align: 'right', color: '#555555' }
      },
      {
        id: 'txt-12',
        type: 'text',
        position: { x: 100, y: 450 },
        size: { width: 600, height: 30 },
        rotation: 0,
        color: '#666666',
        zIndex: 13,
        textContent: 'InnovateStart, New York, NY',
        textStyle: { fontSize: 11, italic: true, color: '#666666' }
      },
      {
        id: 'txt-13',
        type: 'text',
        position: { x: 100, y: 480 },
        size: { width: 600, height: 60 },
        rotation: 0,
        color: '#333333',
        zIndex: 14,
        textContent: '• Built scalable backend services handling 500K+ requests/day using Node.js and Python\n• Implemented automated testing pipelines, increasing code coverage from 45% to 85%',
        textStyle: { fontSize: 11, color: '#333333' }
      },
      {
        id: 'txt-14',
        type: 'text',
        position: { x: 100, y: 540 },
        size: { width: 150, height: 25 },
        rotation: 0,
        color: '#1a1a1a',
        zIndex: 15,
        textContent: 'EDUCATION',
        textStyle: { fontSize: 14, bold: true, color: '#1a1a1a' }
      },
      {
        id: 'txt-15',
        type: 'text',
        position: { x: 100, y: 575 },
        size: { width: 600, height: 60 },
        rotation: 0,
        color: '#333333',
        zIndex: 16,
        textContent: 'Bachelor of Science in Computer Science\nUniversity of California, Berkeley | 2018',
        textStyle: { fontSize: 11, color: '#333333' }
      },
      {
        id: 'txt-16',
        type: 'text',
        position: { x: 100, y: 635 },
        size: { width: 150, height: 25 },
        rotation: 0,
        color: '#1a1a1a',
        zIndex: 17,
        textContent: 'SKILLS',
        textStyle: { fontSize: 14, bold: true, color: '#1a1a1a' }
      },
      {
        id: 'txt-17',
        type: 'text',
        position: { x: 100, y: 670 },
        size: { width: 600, height: 60 },
        rotation: 0,
        color: '#333333',
        zIndex: 18,
        textContent: 'Languages: JavaScript, TypeScript, Python, Java, SQL\nFrameworks: React, Node.js, Express, Django\nTools: Docker, Kubernetes, AWS, Git, Jenkins',
        textStyle: { fontSize: 11, color: '#333333' }
      }
    ]
  },
  {
    id: 'invoice-simple-1',
    name: 'Clean Invoice',
    description: 'Minimalist invoice for freelance work',
    thumbnail: '💼',
    category: 'invoice',
    elements: [
      {
        id: 'title-1', type: 'text', position: { x: 100, y: 60 }, size: { width: 600, height: 40 }, rotation: 0, color: '#111111', zIndex: 1,
        textContent: 'INVOICE', textStyle: { fontSize: 28, bold: true, align: 'center', color: '#111111' }
      },
      {
        id: 'line-header', type: 'line', position: { x: 100, y: 120 }, size: { width: 600, height: 2 }, rotation: 0, color: '#6366f1', zIndex: 2,
        lineStyle: { strokeStyle: 'solid', lineWidth: 2, color: '#6366f1' }
      },
      {
        id: 'billto-1', type: 'text', position: { x: 100, y: 150 }, size: { width: 300, height: 80 }, rotation: 0, color: '#374151', zIndex: 3,
        textContent: 'Bill To:\nClient Name\nclient@email.com', textStyle: { fontSize: 11, color: '#374151' }
      },
      {
        id: 'invmeta-1', type: 'text', position: { x: 500, y: 150 }, size: { width: 200, height: 80 }, rotation: 0, color: '#374151', zIndex: 4,
        textContent: 'Invoice: #001\nDate: Jan 1, 2025', textStyle: { fontSize: 11, align: 'right', color: '#374151' }
      },
      {
        id: 'table-items', type: 'table', position: { x: 100, y: 270 }, size: { width: 600, height: 200 }, rotation: 0, color: '#000000', zIndex: 5,
        tableData: { rows: 4, columns: 4, headerColor: '#f3f4f6', showHeaderBorder: true, showBodyBorder: true, baseFontSize: 11, cellData: {
          '0-0': 'Description', '0-1': 'Hours', '0-2': 'Rate', '0-3': 'Amount',
          '1-0': 'Website Design', '1-1': '8', '1-2': '$75', '1-3': '$600',
          '2-0': 'Development', '2-1': '6', '2-2': '$90', '2-3': '$540'
        } }
      },
      {
        id: 'total-1', type: 'text', position: { x: 500, y: 500 }, size: { width: 200, height: 40 }, rotation: 0, color: '#111111', zIndex: 6,
        textContent: 'Total Due: $1,140', textStyle: { fontSize: 18, bold: true, align: 'right', color: '#111111' }
      }
    ]
  },
  {
    id: 'proposal-1',
    name: 'Project Proposal',
    description: 'Comprehensive proposal template for new projects',
    thumbnail: '📑',
    category: 'proposal',
    elements: [
      { id: 'p-title', type: 'text', position: { x: 100, y: 80 }, size: { width: 600, height: 50 }, rotation: 0, color: '#6366f1', zIndex: 1,
        textContent: 'PROJECT PROPOSAL', textStyle: { fontSize: 32, bold: true, align: 'center', color: '#6366f1' } },
      { id: 'p-client', type: 'text', position: { x: 100, y: 160 }, size: { width: 600, height: 60 }, rotation: 0, color: '#374151', zIndex: 2,
        textContent: 'Prepared for: Client Company\nDate: January 2025', textStyle: { fontSize: 12, color: '#374151', align: 'center' } },
      { id: 'p-scope', type: 'text', position: { x: 100, y: 250 }, size: { width: 600, height: 120 }, rotation: 0, color: '#1f2937', zIndex: 3,
        textContent: 'SCOPE OF WORK:\n\n• Project planning and strategy\n• Design and prototyping\n• Development and implementation\n• Testing and quality assurance\n• Deployment and documentation', textStyle: { fontSize: 11, color: '#1f2937' } },
      { id: 'p-pricing', type: 'table', position: { x: 100, y: 410 }, size: { width: 600, height: 160 }, rotation: 0, color: '#000000', zIndex: 4,
        tableData: { rows: 4, columns: 3, headerColor: '#6366f1', showHeaderBorder: true, showBodyBorder: true, baseFontSize: 11, cellData: {
          '0-0': 'Milestone', '0-1': 'Timeline', '0-2': 'Investment',
          '1-0': 'Phase 1 - Design', '1-1': '2-3 weeks', '1-2': '$1,200',
          '2-0': 'Phase 2 - Development', '2-1': '4-6 weeks', '2-2': '$2,800'
        } } }
    ]
  },
  {
    id: 'quote-1',
    name: 'Service Quote',
    description: 'Professional quote template for estimates',
    thumbnail: '🧾',
    category: 'quote',
    elements: [
      { id: 'q-title', type: 'text', position: { x: 100, y: 60 }, size: { width: 600, height: 50 }, rotation: 0, color: '#6366f1', zIndex: 1,
        textContent: 'SERVICE QUOTE', textStyle: { fontSize: 32, bold: true, align: 'center', color: '#6366f1' } },
      { id: 'q-meta', type: 'text', position: { x: 500, y: 140 }, size: { width: 250, height: 80 }, rotation: 0, color: '#374151', zIndex: 2,
        textContent: 'Quote #: Q-2025-001\nDate: January 15, 2025\nValid for: 30 days', textStyle: { fontSize: 11, align: 'right', color: '#374151' } },
      { id: 'q-table', type: 'table', position: { x: 100, y: 260 }, size: { width: 600, height: 220 }, rotation: 0, color: '#000000', zIndex: 3,
        tableData: { rows: 4, columns: 4, headerColor: '#6366f1', showHeaderBorder: true, showBodyBorder: true, baseFontSize: 11, cellData: {
          '0-0': 'Service', '0-1': 'Hours', '0-2': 'Rate', '0-3': 'Total',
          '1-0': 'Website Design', '1-1': '10', '1-2': '$85', '1-3': '$850',
          '2-0': 'Development', '2-1': '15', '2-2': '$95', '2-3': '$1,425'
        } } }
    ]
  },
  {
    id: 'contract-1',
    name: 'Services Contract',
    description: 'Professional freelance services agreement',
    thumbnail: '✍️',
    category: 'contract',
    elements: [
      { id: 'c-title', type: 'text', position: { x: 100, y: 80 }, size: { width: 600, height: 50 }, rotation: 0, color: '#6366f1', zIndex: 1,
        textContent: 'FREELANCE SERVICES AGREEMENT', textStyle: { fontSize: 24, bold: true, align: 'center', color: '#6366f1' } },
      { id: 'c-body', type: 'text', position: { x: 100, y: 160 }, size: { width: 600, height: 420 }, rotation: 0, color: '#1f2937', zIndex: 2,
        textContent: 'THIS AGREEMENT is made between Client and Freelancer.\n\nSCOPE OF WORK:\nThe Freelancer agrees to provide design and development services as specified.\n\nPAYMENT TERMS:\nNet 15 days. First payment of 50% due upon signing.\n\nINTELLECTUAL PROPERTY:\nAll work product becomes property of Client upon final payment.\n\nCONFIDENTIALITY:\nBoth parties agree to maintain confidentiality.\n\nTERM:\nThis agreement shall remain in effect until project completion.\n\nCLIENT SIGNATURE:\n___________________________ Date: ___________\n\nFREELANCER SIGNATURE:\n___________________________ Date: ___________', textStyle: { fontSize: 11, color: '#1f2937' } }
    ]
  },
  {
    id: 'receipt-1',
    name: 'Payment Receipt',
    description: 'Professional receipt for payments received',
    thumbnail: '🧾',
    category: 'receipt',
    elements: [
      { id: 'r-title', type: 'text', position: { x: 100, y: 80 }, size: { width: 600, height: 50 }, rotation: 0, color: '#6366f1', zIndex: 1,
        textContent: 'PAYMENT RECEIPT', textStyle: { fontSize: 32, bold: true, align: 'center', color: '#6366f1' } },
      { id: 'line-r', type: 'line', position: { x: 100, y: 140 }, size: { width: 600, height: 2 }, rotation: 0, color: '#6366f1', zIndex: 2,
        lineStyle: { strokeStyle: 'solid', lineWidth: 2, color: '#6366f1' } },
      { id: 'r-body', type: 'text', position: { x: 100, y: 180 }, size: { width: 600, height: 200 }, rotation: 0, color: '#1f2937', zIndex: 3,
        textContent: 'Received from: Client Company\nAddress: 123 Business Street, City, State\nInvoice #: INV-001\nDate: January 15, 2025\n\nAmount Received: $3,475.00\nPayment Method: Bank Transfer\nTransaction ID: TRX-2025-001', textStyle: { fontSize: 12, color: '#1f2937' } }
    ]
  },
  {
    id: 'timesheet-1',
    name: 'Weekly Timesheet',
    description: 'Professional timesheet for tracking billable hours',
    thumbnail: '⏱️',
    category: 'timesheet',
    elements: [
      { id: 't-title', type: 'text', position: { x: 100, y: 60 }, size: { width: 600, height: 50 }, rotation: 0, color: '#6366f1', zIndex: 1,
        textContent: 'WEEKLY TIMESHEET', textStyle: { fontSize: 32, bold: true, align: 'center', color: '#6366f1' } },
      { id: 't-meta', type: 'text', position: { x: 100, y: 140 }, size: { width: 600, height: 40 }, rotation: 0, color: '#374151', zIndex: 2,
        textContent: 'Week of: January 13 - 17, 2025 | Total Hours: 40', textStyle: { fontSize: 12, align: 'center', color: '#374151' } },
      { id: 't-table', type: 'table', position: { x: 100, y: 200 }, size: { width: 600, height: 280 }, rotation: 0, color: '#000000', zIndex: 3,
        tableData: { rows: 7, columns: 5, headerColor: '#6366f1', showHeaderBorder: true, showBodyBorder: true, baseFontSize: 11, cellData: {
          '0-0': 'Date', '0-1': 'Project', '0-2': 'Task', '0-3': 'Hours', '0-4': 'Rate',
          '1-0': '1/13', '1-1': 'Client A', '1-2': 'Design', '1-3': '8', '1-4': '$85',
          '2-0': '1/14', '2-1': 'Client A', '2-2': 'Development', '2-3': '8', '2-4': '$95',
          '3-0': '1/15', '3-1': 'Client B', '3-2': 'Consulting', '3-3': '6', '3-4': '$100'
        } } }
    ]
  },
  {
    id: 'invoice-1',
    name: 'Premium Invoice',
    description: 'Professional invoice with modern design and styling',
    thumbnail: '💰',
    category: 'invoice',
    elements: [
      {
        id: 'txt-1',
        type: 'text',
        position: { x: 100, y: 50 },
        size: { width: 300, height: 50 },
        rotation: 0,
        color: '#6366f1',
        zIndex: 1,
        textContent: 'YOUR COMPANY',
        textStyle: { fontSize: 28, bold: true, color: '#6366f1' }
      },
      {
        id: 'txt-2',
        type: 'text',
        position: { x: 100, y: 110 },
        size: { width: 300, height: 120 },
        rotation: 0,
        color: '#4b5563',
        zIndex: 2,
        textContent: '123 Business Street\nCity, State 12345\nemail@company.com\n(555) 123-4567',
        textStyle: { fontSize: 11, color: '#4b5563' }
      },
      {
        id: 'txt-3',
        type: 'text',
        position: { x: 500, y: 50 },
        size: { width: 250, height: 140 },
        rotation: 0,
        color: '#1f2937',
        zIndex: 3,
        textContent: 'BILL TO:\n\nClient Company\nclient@company.com\n123 Client Street\nCity, State 12345',
        textStyle: { fontSize: 11, bold: true, color: '#1f2937' }
      },
      {
        id: 'txt-4',
        type: 'text',
        position: { x: 100, y: 200 },
        size: { width: 200, height: 40 },
        rotation: 0,
        color: '#1f2937',
        zIndex: 4,
        textContent: 'Invoice #: INV-2025-001',
        textStyle: { fontSize: 11, bold: true, color: '#1f2937' }
      },
      {
        id: 'txt-5',
        type: 'text',
        position: { x: 100, y: 235 },
        size: { width: 200, height: 40 },
        rotation: 0,
        color: '#1f2937',
        zIndex: 5,
        textContent: 'Date: January 15, 2025',
        textStyle: { fontSize: 11, color: '#1f2937' }
      },
      {
        id: 'txt-6',
        type: 'text',
        position: { x: 500, y: 200 },
        size: { width: 250, height: 40 },
        rotation: 0,
        color: '#1f2937',
        zIndex: 6,
        textContent: 'Due Date: January 30, 2025',
        textStyle: { fontSize: 11, bold: true, align: 'right', color: '#1f2937' }
      },
      {
        id: 'table-1',
        type: 'table',
        position: { x: 100, y: 300 },
        size: { width: 650, height: 280 },
        rotation: 0,
        color: '#000000',
        zIndex: 8,
        tableData: {
          rows: 5,
          columns: 4,
          cellData: {
            '0-0': 'Description',
            '0-1': 'Qty',
            '0-2': 'Rate',
            '0-3': 'Amount',
            '1-0': 'Web Design Services',
            '1-1': '10',
            '1-2': '$85.00',
            '1-3': '$850.00',
            '2-0': 'Frontend Development',
            '2-1': '15',
            '2-2': '$95.00',
            '2-3': '$1,425.00',
            '3-0': 'Backend Development',
            '3-1': '12',
            '3-2': '$100.00',
            '3-3': '$1,200.00'
          },
          headerColor: '#6366f1',
          showHeaderBorder: true,
          showBodyBorder: true,
          baseFontSize: 11
        }
      },
      {
        id: 'txt-8',
        type: 'text',
        position: { x: 500, y: 620 },
        size: { width: 250, height: 30 },
        rotation: 0,
        color: '#1f2937',
        zIndex: 9,
        textContent: 'Subtotal: $3,475.00',
        textStyle: { fontSize: 12, align: 'right', color: '#1f2937' }
      },
      {
        id: 'txt-10',
        type: 'text',
        position: { x: 500, y: 655 },
        size: { width: 250, height: 30 },
        rotation: 0,
        color: '#1f2937',
        zIndex: 11,
        textContent: 'Total Due: $3,475.00',
        textStyle: { fontSize: 16, bold: true, align: 'right', color: '#6366f1' }
      }
    ]
  },
  {
    id: 'letter-1',
    name: 'Formal Letter',
    description: 'Professional business letter',
    thumbnail: '✉️',
    category: 'letter',
    elements: [
      {
        id: 'txt-1',
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 600, height: 60 },
        rotation: 0,
        color: '#000000',
        zIndex: 1,
        textContent: 'Your Company Name',
        textStyle: { fontSize: 18, bold: true, color: '#000000' }
      },
      {
        id: 'txt-2',
        type: 'text',
        position: { x: 100, y: 150 },
        size: { width: 250, height: 30 },
        rotation: 0,
        color: '#666666',
        zIndex: 2,
        textContent: '123 Business Street',
        textStyle: { fontSize: 11, color: '#666666' }
      },
      {
        id: 'txt-3',
        type: 'text',
        position: { x: 100, y: 170 },
        size: { width: 250, height: 30 },
        rotation: 0,
        color: '#666666',
        zIndex: 3,
        textContent: 'City, State 12345',
        textStyle: { fontSize: 11, color: '#666666' }
      },
      {
        id: 'txt-4',
        type: 'text',
        position: { x: 100, y: 220 },
        size: { width: 600, height: 30 },
        rotation: 0,
        color: '#000000',
        zIndex: 4,
        textContent: 'Date: January 15, 2024',
        textStyle: { fontSize: 11, color: '#000000' }
      },
      {
        id: 'txt-5',
        type: 'text',
        position: { x: 100, y: 280 },
        size: { width: 600, height: 200 },
        rotation: 0,
        color: '#000000',
        zIndex: 5,
        textContent: 'Dear [Recipient],\n\nI am writing to...\n\nThank you for your consideration.\n\nSincerely,\n[Your Name]',
        textStyle: { fontSize: 12, color: '#000000' }
      }
    ]
  },
  {
    id: 'report-1',
    name: 'Annual Report',
    description: 'Corporate report template',
    thumbnail: '📊',
    category: 'report',
    elements: [
      {
        id: 'txt-1',
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 600, height: 50 },
        rotation: 0,
        color: '#000000',
        zIndex: 1,
        textContent: 'ANNUAL REPORT 2024',
        textStyle: { fontSize: 28, bold: true, align: 'center', color: '#000000' }
      },
      {
        id: 'txt-2',
        type: 'text',
        position: { x: 100, y: 170 },
        size: { width: 600, height: 30 },
        rotation: 0,
        color: '#666666',
        zIndex: 2,
        textContent: 'Company Performance Overview',
        textStyle: { fontSize: 16, align: 'center', color: '#666666' }
      },
      {
        id: 'table-1',
        type: 'table',
        position: { x: 100, y: 250 },
        size: { width: 600, height: 300 },
        rotation: 0,
        color: '#000000',
        zIndex: 3,
        tableData: {
          rows: 6,
          columns: 3,
          cellData: {
            '0-0': 'Quarter',
            '0-1': 'Revenue',
            '0-2': 'Growth',
            '1-0': 'Q1 2024',
            '1-1': '$1.2M',
            '1-2': '+15%',
            '2-0': 'Q2 2024',
            '2-1': '$1.5M',
            '2-2': '+20%',
            '3-0': 'Q3 2024',
            '3-1': '$1.8M',
            '3-2': '+25%'
          },
          headerColor: '#2563eb',
          showHeaderBorder: true,
          showBodyBorder: true,
          baseFontSize: 12
        }
      }
    ]
  },
  {
    id: 'form-1',
    name: 'Application Form',
    description: 'Multi-purpose form template',
    thumbnail: '📝',
    category: 'form',
    elements: [
      {
        id: 'txt-1',
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 600, height: 60 },
        rotation: 0,
        color: '#000000',
        zIndex: 1,
        textContent: 'Application Form',
        textStyle: { fontSize: 24, bold: true, align: 'center', color: '#000000' }
      },
      {
        id: 'txt-2',
        type: 'text',
        position: { x: 100, y: 180 },
        size: { width: 200, height: 25 },
        rotation: 0,
        color: '#000000',
        zIndex: 2,
        textContent: 'Full Name:',
        textStyle: { fontSize: 12, bold: true, color: '#000000' }
      },
      {
        id: 'line-1',
        type: 'line',
        position: { x: 300, y: 195 },
        size: { width: 400, height: 1 },
        rotation: 0,
        color: '#cccccc',
        zIndex: 3,
        lineStyle: { strokeStyle: 'solid', lineWidth: 1, color: '#cccccc' }
      },
      {
        id: 'txt-3',
        type: 'text',
        position: { x: 100, y: 230 },
        size: { width: 200, height: 25 },
        rotation: 0,
        color: '#000000',
        zIndex: 4,
        textContent: 'Email:',
        textStyle: { fontSize: 12, bold: true, color: '#000000' }
      },
      {
        id: 'line-2',
        type: 'line',
        position: { x: 300, y: 245 },
        size: { width: 400, height: 1 },
        rotation: 0,
        color: '#cccccc',
        zIndex: 5,
        lineStyle: { strokeStyle: 'solid', lineWidth: 1, color: '#cccccc' }
      },
      {
        id: 'txt-4',
        type: 'text',
        position: { x: 100, y: 280 },
        size: { width: 200, height: 25 },
        rotation: 0,
        color: '#000000',
        zIndex: 6,
        textContent: 'Phone:',
        textStyle: { fontSize: 12, bold: true, color: '#000000' }
      },
      {
        id: 'line-3',
        type: 'line',
        position: { x: 300, y: 295 },
        size: { width: 400, height: 1 },
        rotation: 0,
        color: '#cccccc',
        zIndex: 7,
        lineStyle: { strokeStyle: 'solid', lineWidth: 1, color: '#cccccc' }
      }
    ]
  },
  {
    id: 'resume-2',
    name: 'Creative Resume',
    description: 'Stand-out creative resume',
    thumbnail: '🎨',
    category: 'resume',
    elements: [
      {
        id: 'txt-1',
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 500, height: 50 },
        rotation: 0,
        color: '#2563eb',
        zIndex: 1,
        textContent: 'JANE SMITH',
        textStyle: { fontSize: 32, bold: true, color: '#2563eb' }
      },
      {
        id: 'line-1',
        type: 'line',
        position: { x: 100, y: 160 },
        size: { width: 500, height: 3 },
        rotation: 0,
        color: '#2563eb',
        zIndex: 2,
        lineStyle: { strokeStyle: 'solid', lineWidth: 3, color: '#2563eb' }
      },
      {
        id: 'txt-2',
        type: 'text',
        position: { x: 100, y: 200 },
        size: { width: 500, height: 30 },
        rotation: 0,
        color: '#666666',
        zIndex: 3,
        textContent: 'UX Designer & Creative Thinker',
        textStyle: { fontSize: 16, color: '#666666' }
      },
      {
        id: 'txt-3',
        type: 'text',
        position: { x: 100, y: 250 },
        size: { width: 600, height: 100 },
        rotation: 0,
        color: '#000000',
        zIndex: 4,
        textContent: 'PROFESSIONAL SUMMARY\nExperienced UX designer with a passion for creating intuitive and engaging user experiences...',
        textStyle: { fontSize: 11, color: '#000000' }
      }
    ]
  }
]

// Focus solely on freelancer-relevant templates
const freelancerTemplates = templates.filter(t => 
  ['invoice', 'proposal', 'quote', 'contract', 'receipt', 'timesheet'].includes(t.category)
)

const Templates = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const setSheets = useEditorStore(state => state.setSheets)
  const resetApp = useEditorStore(state => state.resetApp)

  const handleTemplateSelect = async (template: Template) => {
    // Check if user is authenticated
    if (!token) {
      // Redirect to login page
      navigate('/signin', { 
        state: { 
          from: '/templates',
          message: 'Please sign in to use templates' 
        } 
      })
      return
    }

    setSelectedTemplate(template.id)
    setLoading(true)

    try {
      // Reset the editor to blank state
      resetApp()

      // Create a new sheet with the template elements
      // This would typically come from template data
      const newSheet = {
        id: `sheet-${Date.now()}`,
        title: template.name,
        elements: template.elements,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        showMargins: false,
        showGrid: false
      }

      setSheets([newSheet])
      
      // Navigate to PDF editor
      setTimeout(() => {
        navigate('/pdf-editor')
      }, 500)
    } catch (error) {
      console.error('Error loading template:', error)
      setLoading(false)
      setSelectedTemplate(null)
    }
  }

  const handleCreateFromScratch = async () => {
    if (!token) {
      navigate('/signin', {
        state: { from: '/templates', message: 'Please sign in to start from scratch' }
      })
      return
    }
    try {
      resetApp()
      const newSheet = {
        id: `sheet-${Date.now()}`,
        title: 'Untitled',
        elements: [],
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        showMargins: false,
        showGrid: false,
      }
      setSheets([newSheet])
      navigate('/pdf-editor')
    } catch (e) {
      console.error('Failed to create from scratch', e)
    }
  }

  const categoryColors: Record<string, string> = {
    invoice: 'bg-green-100 text-green-700 hover:bg-green-200',
    proposal: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    quote: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    contract: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    receipt: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
    timesheet: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    resume: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    letter: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    report: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    form: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 py-16 sm:py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-5xl sm:text-6xl font-bold text-white">
              Professional Templates
            </h1>
          </div>
          <p className="text-xl text-purple-100 text-center max-w-2xl mx-auto">
            Create stunning documents in minutes with our beautifully designed templates
          </p>
        </div>
      </div>

      {/* Templates Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Start Building Your Document
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our collection of professionally designed templates
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Create from scratch card */}
          <div className="group cursor-pointer" onClick={handleCreateFromScratch}>
            <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 flex flex-col h-[640px]">
                <div className="flex flex-col items-center justify-center py-12 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mb-1">Create from scratch</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Start with a blank A4 page</div>
                </div>
                {/* Hover toolbar */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-end">
                    <span className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm shadow-lg">Start</span>
                  </div>
                </div>
                {!token && (
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                      <Lock className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {freelancerTemplates.map((template) => (
            <div key={template.id} className="group cursor-pointer" onClick={() => handleTemplateSelect(template)}>
              {/* Gradient Frame */}
              <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                {/* Card Body */}
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 flex flex-col h-[640px]">
                  {/* Preview */}
                  <div className="relative bg-gray-50 dark:bg-gray-900/40 overflow-hidden flex items-center justify-center py-5 flex-none">
                    <div className="transition-transform duration-500 group-hover:scale-[1.02]">
                      <TemplatePreview elements={template.elements} width={340} />
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${categoryColors[template.category] || 'bg-gray-100 text-gray-700'} border border-white/70 dark:border-gray-700 backdrop-blur-sm shadow-sm capitalize`}>
                        {template.category}
                      </Badge>
                    </div>
                    {/* Favorite icon */}
                    <div className="absolute top-3 right-3">
                      <button className="p-2 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-sm border border-white/70 dark:border-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-600 dark:text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"/></svg>
                      </button>
                    </div>

                    {/* Shine on hover */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute -inset-1 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>

                    {/* Lock Overlay for Unauthenticated Users */}
                    {!token && (
                      <div className="absolute inset-0 bg-black/20 dark:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                          <Lock className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 mt-auto">
                    <h3
                      className="text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-2 group-hover:text-purple-600 transition-colors truncate"
                      title={template.name}
                    >
                      {template.name}
                    </h3>
                    <p
                      className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 overflow-hidden text-ellipsis"
                      style={{ maxHeight: '3.2em', lineHeight: '1.6em' }}
                      title={template.description}
                    >
                      {template.description}
                    </p>
                    {/* Hover CTA like Canva */}
                    <div className="flex justify-end">
                      {token ? (
                        <button className="invisible group-hover:visible inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm shadow-lg dark:bg-white dark:text-gray-900">
                          Use
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="h-8" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected Overlay */}
                {selectedTemplate === template.id && loading && (
                  <div className="absolute inset-0 rounded-3xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Loading template...</p>
                    </div>
                  </div>
                )}

                {selectedTemplate === template.id && !loading && (
                  <div className="absolute top-3 right-3 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg z-10">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Message */}
        <div className="text-center py-16 mt-12">
          {!token ? (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full border border-purple-200">
                <Lock className="w-5 h-5 text-purple-600" />
                <p className="text-purple-700 font-semibold">
                  Sign in to access all templates
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate('/signin')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl border-2 border-purple-600 hover:bg-purple-50 transition-all"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full border border-purple-200">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <p className="text-purple-700 font-semibold">
                More templates coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Templates

