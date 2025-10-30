import { cn } from "@/core/lib/cn"
import * as React from "react"

type BrandIconProps = {
  id: string
  name: string
  className?: string
}

// Simple, stylized brand-like SVGs. No external libs used.
// Only a curated subset is explicitly drawn; the rest fall back to monograms.

function SvgEmail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" className="text-foreground/80" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function SvgGmail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M2 7.5 12 13.5 22 7.5v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 7.5 12 13.5 22 7.5 12 4z" fill="currentColor" className="text-red-600 dark:text-red-400" />
    </svg>
  )
}

function SvgOutlook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="6" width="10" height="12" rx="2" className="fill-blue-600 dark:fill-blue-400" />
      <rect x="9" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" className="text-blue-700 dark:text-blue-300" />
      <circle cx="8" cy="12" r="2.6" fill="white" />
    </svg>
  )
}

function SvgGoogleDrive(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M7 3h5l5 8-5 8H7L2 11z" fill="currentColor" className="text-green-600 dark:text-green-400" />
      <path d="M12 3h5l5 8-5 8h-5l5-8z" fill="currentColor" className="text-yellow-500 dark:text-yellow-400" />
      <path d="M2 11h5l5 8H7z" fill="currentColor" className="text-blue-600 dark:text-blue-400" />
    </svg>
  )
}

function SvgOneDrive(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M8 16c-3.5 0-5-2.5-5-4.5C3 9 5 7 7.5 7.5 8.6 5.5 11 4 13.5 5c2.8 1 3.5 3.6 3.5 5.5 1.6.2 3 1.6 3 3.5 0 2-1.7 3.5-3.7 3.5z" fill="currentColor" className="text-blue-600 dark:text-blue-400" />
    </svg>
  )
}

function SvgMongoDB(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2s2.5 3 3.2 6.7c.6 3.2.2 6.7-2.3 9.3-.5.5-1.4 1.4-1.4 2 0 0-.6-1.6-.5-2.3C11.3 16.1 8 14.2 8 9.9 8 5.8 12 2 12 2z" fill="currentColor" className="text-emerald-600 dark:text-emerald-400" />
      <path d="M12 20s-.2 1.3-.2 2" stroke="currentColor" strokeWidth="1.4" className="text-emerald-700 dark:text-emerald-300" />
    </svg>
  )
}

function SvgMySQL(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M6 16c2-3 5-6 7.5-6.5 2-.5 3.5 1 4 2.5M14.5 9.5c-.5-2 1-4 3.5-4M4 18c2.5-1 6-.5 7.5.5 1 .6 3 1 5-.5" className="text-sky-600 dark:text-sky-400" />
    </svg>
  )
}

function SvgPostgres(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M8 7c0-2.5 2-4 4-4s4 1.5 4 4c3.2 0 4 2.4 4 4.5S18.5 17 16 17h-1.5c-.8 0-1.5.7-1.5 1.5V21h-2v-2.5C11 17.7 10.3 17 9.5 17H8c-2.5 0-4-2-4-5s1.5-5 4-5z" fill="currentColor" className="text-blue-700 dark:text-blue-400" />
      <circle cx="12" cy="9" r="1.5" fill="white" />
    </svg>
  )
}

function SvgOracleDB(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="8" width="18" height="8" rx="4" className="fill-red-600 dark:fill-red-500" />
      <rect x="5.5" y="10" width="13" height="4" rx="2" fill="white" />
    </svg>
  )
}

function SvgS3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 6h12l2 3v9l-2 2H6l-2-2V9z" stroke="currentColor" strokeWidth="1.6" className="text-orange-500 dark:text-orange-400" />
      <path d="M8 9h8v7H8z" className="fill-orange-500/20 dark:fill-orange-400/20" />
      <text x="12" y="16" textAnchor="middle" fontSize="6" fill="currentColor">S3</text>
    </svg>
  )
}

function SvgDynamoDB(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="5" y="4" width="14" height="16" rx="2" className="fill-blue-600 dark:fill-blue-500" />
      <rect x="7" y="7" width="10" height="2" rx="1" fill="white" />
      <rect x="7" y="11" width="10" height="2" rx="1" fill="white" />
      <rect x="7" y="15" width="10" height="2" rx="1" fill="white" />
    </svg>
  )
}

function SvgRedshift(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" className="fill-red-600 dark:fill-red-500" />
      <rect x="10" y="4" width="4" height="16" rx="2" className="fill-red-400 dark:fill-red-300" />
    </svg>
  )
}

function SvgGoogleBigQuery(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="10" cy="10" r="6" className="fill-blue-600 dark:fill-blue-500" />
      <rect x="14" y="14" width="7" height="2.5" rx="1.25" transform="rotate(45 14 14)" className="fill-blue-400 dark:fill-blue-300" />
    </svg>
  )
}

function SvgSnowflake(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 2v20M4.2 6.2l15.6 11.6M4.2 17.8 19.8 6.2M2 12h20" className="text-sky-400 dark:text-sky-300" />
    </svg>
  )
}

function SvgClickHouse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="4" width="3" height="16" className="fill-yellow-500" />
      <rect x="9" y="4" width="3" height="16" className="fill-yellow-500" />
      <rect x="14" y="4" width="3" height="16" className="fill-yellow-500" />
      <rect x="19" y="9" width="1" height="6" className="fill-yellow-500" />
    </svg>
  )
}

function SvgPostmark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="8" className="text-yellow-600 dark:text-yellow-500" />
      <path d="M6 10h12M6 14h12" />
    </svg>
  )
}

// (intentionally left blank - consolidated brand map is defined later in the file)

function hashStringToHue(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 360
}

// Removed letter-based monogram fallback; we now use an abstract glyph.

function SvgYahooMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" className="fill-purple-600 dark:fill-purple-500" />
      <path d="M6 9h12M6 13h12" stroke="white" strokeWidth="1.6" />
    </svg>
  )
}

function SvgZohoMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="7" width="6" height="10" rx="1.5" className="fill-green-600" />
      <rect x="9" y="7" width="6" height="10" rx="1.5" className="fill-red-600" />
      <rect x="15" y="7" width="6" height="10" rx="1.5" className="fill-yellow-500" />
    </svg>
  )
}

function SvgProtonMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 6h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" className="fill-gray-800 dark:fill-gray-300" />
      <path d="M4 6l8 6 8-6V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1z" fill="white" opacity=".9" />
    </svg>
  )
}

function SvgAppleMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3" className="fill-sky-500 dark:fill-sky-400" />
      <path d="M4.5 7 12 12.5 19.5 7" stroke="white" strokeWidth="1.6" />
    </svg>
  )
}

function SvgExchange(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="6" width="8" height="12" rx="1.5" className="fill-blue-700" />
      <rect x="9" y="8" width="12" height="8" rx="2" className="fill-blue-500" />
      <path d="M6 10h2M6 12h2M6 14h2" stroke="white" strokeWidth="1.6" />
    </svg>
  )
}

function SvgDropbox(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-blue-600 dark:text-blue-400", props.className)}>
      <path d="M7 3l5 3-5 3-5-3 5-3zm10 0l5 3-5 3-5-3 5-3zM7 12l5 3-5 3-5-3 5-3zm10 0l5 3-5 3-5-3 5-3zM12 15l5 3-5 3-5-3 5-3z" />
    </svg>
  )
}

function SvgBoxCloud(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="6" width="16" height="12" rx="3" className="fill-blue-500" />
      <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" strokeWidth="1.8" />
    </svg>
  )
}

function SvgICloud(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M8 16c-2.2 0-3.5-1.8-3.5-3.5S5.6 9 7.5 9C8.3 7.2 10 6 12 6c2.4 0 4 1.8 4 4 1.8.2 3 1.6 3 3.2C19 15.5 17.4 17 15.5 17H8z" className="fill-sky-500 dark:fill-sky-400" />
    </svg>
  )
}

function SvgAzureBlob(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 6h12l-4 12H2z" className="fill-blue-600" />
      <path d="M12 6h6l-4 12H8z" className="fill-blue-400" />
    </svg>
  )
}

function SvgAzureDataLake(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 18c3-3 13-3 16 0-3-6-13-6-16 0z" className="fill-blue-500" />
      <path d="M6 7l5-3 7 4-5 3z" className="fill-blue-700" />
    </svg>
  )
}

function SvgGCS(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" className="fill-blue-500" />
      <rect x="7" y="9" width="10" height="8" rx="2" className="fill-white" />
    </svg>
  )
}

function SvgWasabi(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-green-600 dark:text-green-500", props.className)}>
      <path d="M12 2l7 5v10l-7 5-7-5V7z" />
      <path d="M9 10l3-2 3 2-3 2z" className="text-white" />
    </svg>
  )
}

function SvgBackblaze(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-red-600 dark:text-red-500", props.className)}>
      <path d="M12 3c2 2 2 4.5 0 6.5C10 7.5 9 5.5 10 4c.4-.6 1-1 2-1z" />
      <path d="M7 13c0 2.8 2.2 5 5 5s5-2.2 5-5c-1.2.9-3 1.2-5 1.2s-3.8-.3-5-1.2z" />
    </svg>
  )
}

function SvgDOSpaces(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" className="fill-indigo-600" />
      <circle cx="9" cy="10" r="2" fill="white" />
      <circle cx="15" cy="14" r="2" fill="white" />
    </svg>
  )
}

function SvgMinIO(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-rose-600 dark:text-rose-500", props.className)}>
      <rect x="4" y="9" width="16" height="6" rx="3" />
      <path d="M6 9l6-4 6 4" />
    </svg>
  )
}

function SvgAlibabaOSS(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" className="fill-orange-500" />
      <path d="M6 12h12" stroke="white" strokeWidth="1.8" />
    </svg>
  )
}

function SvgIBMCOS(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="7" width="16" height="10" rx="2" className="fill-sky-600" />
      <path d="M6 9h12M6 12h12M6 15h12" stroke="white" strokeWidth="1.2" />
    </svg>
  )
}

function SvgOracleOSS(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="8" width="16" height="8" rx="4" className="fill-red-600" />
    </svg>
  )
}

function SvgCloudflareR2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-orange-400 dark:text-orange-300", props.className)}>
      <path d="M7 16h10a4 4 0 0 0 0-8 6 6 0 0 0-11 2A3.5 3.5 0 0 0 7 16z" />
    </svg>
  )
}

function SvgSQLServer(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 7c2 1.5 6 2.5 8 2.5S18 8.5 20 7M4 12c2 1.5 6 2.5 8 2.5S18 13.5 20 12M4 17c2 1.5 6 2.5 8 2.5S18 18.5 20 17" className="text-red-600 dark:text-red-500" />
    </svg>
  )
}

function SvgMariaDB(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-amber-700 dark:text-amber-600", props.className)}>
      <path d="M4 16c2-3 6-5 11-5 2 0 5 2 5 3-3 2-9 4-16 2z" />
      <circle cx="16" cy="10" r="1" className="text-white" />
    </svg>
  )
}

function SvgSQLite(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="5" y="4" width="14" height="16" rx="2" className="text-cyan-600 dark:text-cyan-500" />
      <path d="M9 9h6M9 12h6M9 15h6" />
    </svg>
  )
}

function SvgDb2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-green-700 dark:text-green-500", props.className)}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <text x="12" y="14.5" textAnchor="middle" fontSize="7" fill="white">DB2</text>
    </svg>
  )
}

function SvgSAPHANA(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 7h18l-6 10H3z" className="fill-sky-600" />
      <text x="9" y="14.5" fontSize="5" fill="white">HANA</text>
    </svg>
  )
}

function SvgRedis(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-rose-600 dark:text-rose-500", props.className)}>
      <path d="M4 9l8-3 8 3-8 3z" />
      <path d="M4 12l8-3 8 3-8 3z" opacity=".9" />
      <path d="M4 15l8-3 8 3-8 3z" opacity=".8" />
    </svg>
  )
}

function SvgElasticsearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="8" className="fill-yellow-500" />
      <rect x="6" y="10" width="12" height="2" className="fill-black/70" />
      <rect x="6" y="14" width="12" height="2" className="fill-black/70" />
    </svg>
  )
}

function SvgOpenSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 12a6 6 0 0 1 12 0v0a6 6 0 0 1-12 0z" className="fill-blue-600" />
      <rect x="14" y="14" width="6" height="2" rx="1" transform="rotate(45 14 14)" className="fill-blue-400" />
    </svg>
  )
}

function SvgInfluxDB(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <polygon points="12,3 20,8 17,20 7,20 4,8" className="fill-indigo-600" />
      <polygon points="12,6 17,9 15.5,18 8.5,18 7,9" className="fill-indigo-400" />
    </svg>
  )
}

function SvgPrometheus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-orange-600 dark:text-orange-500", props.className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6l2 4h-4l2-4zm0 5l2 3h-4l2-3zm-3 4h6v2H9z" fill="white" />
    </svg>
  )
}

function SvgKafka(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="7" r="2.5" />
      <circle cx="16" cy="17" r="2.5" />
      <path d="M10.5 10.5l3-2M10.5 13.5l3 2" />
    </svg>
  )
}

function SvgRabbitMQ(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-orange-500", props.className)}>
      <rect x="3" y="8" width="18" height="8" rx="2" />
      <rect x="5" y="5" width="3" height="6" rx="1" fill="white" />
      <rect x="10" y="5" width="3" height="6" rx="1" fill="white" />
      <circle cx="18" cy="12" r="1.5" fill="white" />
    </svg>
  )
}

function SvgGoogleSheets(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" className="fill-green-600" />
      <rect x="8" y="8" width="8" height="1.5" fill="white" />
      <rect x="8" y="11" width="8" height="1.5" fill="white" />
      <rect x="8" y="14" width="8" height="1.5" fill="white" />
    </svg>
  )
}

function SvgExcel(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-green-700 dark:text-green-600", props.className)}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 8l6 8M15 8l-6 8" stroke="white" strokeWidth="1.6" />
    </svg>
  )
}

function SvgAirtable(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 9l9-5 9 5-9 5z" className="fill-amber-500" />
      <path d="M12 14l9-5v7l-9 5z" className="fill-sky-500" />
      <path d="M12 14L3 9v7l9 5z" className="fill-rose-500" />
    </svg>
  )
}

function SvgNotion(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M8 18V7h.5l7.5 9V7" />
    </svg>
  )
}

function SvgWordPress(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" className="fill-sky-700 dark:fill-sky-600" />
      <path d="M6.5 12c0 2.4 1.4 4.5 3.5 5.5L7.5 9.5C7 10 6.5 11 6.5 12zm10.8-3.2c-.6-1.1-1.7-2-2.8-2.2l3.2 10.5C19 15.6 19 13 17.3 8.8zM12 7c-.9 0-1.8.2-2.5.5l3.7 10.7c.6-.1 1.2-.3 1.7-.6L12 7z" fill="white" />
    </svg>
  )
}

function SvgContentful(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="8" cy="8" r="4" className="fill-sky-500" />
      <circle cx="16" cy="16" r="4" className="fill-rose-500" />
      <circle cx="8" cy="16" r="4" className="fill-amber-500" />
    </svg>
  )
}

function SvgStrapi(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-indigo-600", props.className)}>
      <path d="M5 5h9l5 5-9 9-5-5z" />
    </svg>
  )
}

function SvgDrupal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-sky-600", props.className)}>
      <path d="M12 3c1.5 2 4 3 4 5.5S13.5 14 12 14s-4-2.5-4-5.5S10.5 5 12 3z" />
      <path d="M6 15c0 3.9 3 6 6 6s6-2.1 6-6c-1 1-3 2-6 2s-5-1-6-2z" opacity=".9" />
    </svg>
  )
}

function SvgSalesforce(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-sky-500", props.className)}>
      <circle cx="9" cy="12" r="4" />
      <circle cx="14" cy="10" r="4" />
      <circle cx="17" cy="14" r="3.2" />
    </svg>
  )
}

function SvgHubSpot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-orange-500", props.className)}>
      <circle cx="18" cy="6" r="2" />
      <circle cx="10" cy="14" r="4" />
      <rect x="10" y="4" width="1.6" height="6" />
      <rect x="14" y="14" width="6" height="1.6" />
    </svg>
  )
}

function SvgDynamics(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 5l8 3-8 11z" className="fill-blue-700" />
      <path d="M14 8l4 2-8 9z" className="fill-blue-500" />
    </svg>
  )
}

function SvgNetSuite(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 5h8v6H5z" className="fill-sky-700" />
      <path d="M11 11h8v8h-8z" className="fill-sky-500" />
    </svg>
  )
}

function SvgSAP(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className={cn("text-sky-600", props.className)}>
      <path d="M3 7h18l-6 10H3z" />
    </svg>
  )
}

function SvgOdoo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="7" cy="12" r="3" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="17" cy="12" r="3" />
    </svg>
  )
}

const BRAND_COMPONENTS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  email: SvgEmail,
  gmail: SvgGmail,
  outlook: SvgOutlook,
  "yahoo-mail": SvgYahooMail,
  "zoho-mail": SvgZohoMail,
  "proton-mail": SvgProtonMail,
  "apple-mail": SvgAppleMail,
  exchange: SvgExchange,
  "google-drive": SvgGoogleDrive,
  onedrive: SvgOneDrive,
  dropbox: SvgDropbox,
  box: SvgBoxCloud,
  icloud: SvgICloud,
  mongodb: SvgMongoDB,
  atlas: SvgMongoDB,
  mysql: SvgMySQL,
  postgresql: SvgPostgres,
  neon: SvgPostgres,
  "oracle-db": SvgOracleDB,
  s3: SvgS3,
  redshift: SvgRedshift,
  dynamodb: SvgDynamoDB,
  bigquery: SvgGoogleBigQuery,
  snowflake: SvgSnowflake,
  clickhouse: SvgClickHouse,
  postmark: SvgPostmark,
  "azure-blob": SvgAzureBlob,
  "azure-datalake": SvgAzureDataLake,
  gcs: SvgGCS,
  wasabi: SvgWasabi,
  b2: SvgBackblaze,
  "do-spaces": SvgDOSpaces,
  minio: SvgMinIO,
  "alibaba-oss": SvgAlibabaOSS,
  "ibm-cos": SvgIBMCOS,
  "oracle-oss": SvgOracleOSS,
  "cloudflare-r2": SvgCloudflareR2,
  sqlserver: SvgSQLServer,
  mariadb: SvgMariaDB,
  sqlite: SvgSQLite,
  db2: SvgDb2,
  "sap-hana": SvgSAPHANA,
  redis: SvgRedis,
  elasticsearch: SvgElasticsearch,
  opensearch: SvgOpenSearch,
  influxdb: SvgInfluxDB,
  prometheus: SvgPrometheus,
  kafka: SvgKafka,
  rabbitmq: SvgRabbitMQ,
  "google-sheets": SvgGoogleSheets,
  "excel-online": SvgExcel,
  airtable: SvgAirtable,
  notion: SvgNotion,
  wordpress: SvgWordPress,
  contentful: SvgContentful,
  strapi: SvgStrapi,
  drupal: SvgDrupal,
  salesforce: SvgSalesforce,
  hubspot: SvgHubSpot,
  dynamics: SvgDynamics,
  netsuite: SvgNetSuite,
  "sap-erp": SvgSAP,
  odoo: SvgOdoo
}

const SLUG_MAP: Record<string, string> = {
  // Email
  email: "protonmail",
  gmail: "gmail",
  outlook: "microsoftoutlook",
  "yahoo-mail": "yahoo",
  "zoho-mail": "zoho",
  "proton-mail": "protonmail",
  "apple-mail": "apple",
  exchange: "microsoftexchange",

  // Cloud / Object storage
  "google-drive": "googledrive",
  onedrive: "microsoftonedrive",
  dropbox: "dropbox",
  box: "box",
  icloud: "icloud",
  s3: "amazons3",
  "azure-blob": "microsoftazure",
  "azure-datalake": "microsoftazure",
  gcs: "googlecloud",
  wasabi: "wasabi",
  b2: "backblaze",
  "do-spaces": "digitalocean",
  minio: "minio",
  "alibaba-oss": "alibabacloud",
  "ibm-cos": "ibmcloud",
  "oracle-oss": "oracle",
  "cloudflare-r2": "cloudflare",

  // Relational
  mysql: "mysql",
  postgresql: "postgresql",
  sqlserver: "microsoftsqlserver",
  "oracle-db": "oracle",
  mariadb: "mariadb",
  sqlite: "sqlite",
  db2: "ibmdb2",
  "sap-hana": "saphana",
  "aurora-mysql": "amazonrds",
  "aurora-postgres": "amazonrds",
  cockroachdb: "cockroachlabs",
  "google-cloud-sql": "googlecloud",
  "azure-db-mysql": "microsoftazure",
  "azure-db-postgres": "microsoftazure",
  neon: "neon",
  planetscale: "planetscale",
  tidb: "tidb",
  yugabytedb: "yugabytedb",
  "amazon-rds": "amazonrds",

  // Document / NoSQL
  mongodb: "mongodb",
  couchdb: "apachecouchdb",
  dynamodb: "amazondynamodb",
  cosmos: "azurecosmosdb",
  fauna: "fauna",
  couchbase: "couchbase",
  rethinkdb: "rethinkdb",
  arangodb: "arangodb",
  orientdb: "orientdb",
  aerospike: "aerospike",
  scylladb: "scylladb",
  foundationdb: "foundationdb",

  // KV / Cache
  redis: "redis",
  keydb: "keydb",
  memcached: "memcached",
  etcd: "etcd",
  consul: "consul",

  // Graph
  neo4j: "neo4j",
  janusgraph: "janusgraph",
  tigergraph: "tigergraph",
  neptune: "amazonneptune",

  // Search / Analytics
  elasticsearch: "elasticsearch",
  opensearch: "opensearch",
  solr: "apachesolr",
  splunk: "splunk",
  sumologic: "sumologic",
  logzio: "logzio",

  // Time-series / Columnar analytics
  influxdb: "influxdb",
  timescaledb: "timescale",
  prometheus: "prometheus",
  victoriametrics: "victoriametrics",
  questdb: "questdb",
  druid: "apachedruid",
  clickhouse: "clickhouse",
  pinot: "apachepinot",
  cratedb: "cratedb",

  // Warehouses & Lakes
  snowflake: "snowflake",
  bigquery: "googlebigquery",
  redshift: "amazonredshift",
  databricks: "databricks",
  hive: "apachehive",
  hbase: "apachehbase",
  synapse: "azuresynapseanalytics",
  teradata: "teradata",
  vertica: "vertica",
  greenplum: "greenplum",
  netezza: "ibm",
  exadata: "oracle",
  hdfs: "apachehadoop",
  "delta-lake": "deltalake",
  iceberg: "apacheiceberg",
  hudi: "apachehudi",

  // Messaging / Streaming
  kafka: "apachekafka",
  rabbitmq: "rabbitmq",
  activemq: "apacheactivemq",
  kinesis: "amazonkinesis",
  pubsub: "googlecloud",
  eventhubs: "microsoftazure",
  pulsar: "apachepulsar",
  redpanda: "redpanda",

  // Files / Shares
  sharepoint: "microsoftsharepoint",
  "g-shared-drives": "googledrive",

  // Spreadsheets / Workspaces
  "google-sheets": "googlesheets",
  "excel-online": "microsoftexcel",
  airtable: "airtable",
  smartsheet: "smartsheet",
  notion: "notion",
  coda: "coda",

  // Logs / Monitoring
  "cloudwatch-logs": "amazoncloudwatch",
  "azure-monitor": "azuremonitor",
  "gcp-logging": "googlecloud",
  loki: "loki",
  datadog: "datadog",
  newrelic: "newrelic",

  // CMS / Content
  wordpress: "wordpress",
  contentful: "contentful",
  strapi: "strapi",
  drupal: "drupal",

  // CRM / ERP
  salesforce: "salesforce",
  hubspot: "hubspot",
  dynamics: "microsoftdynamics365",
  netsuite: "netsuite",
  "sap-erp": "sap",
  odoo: "odoo"
}

function AbstractGlyph({ name, className }: { name: string; className?: string }) {
  const hue = hashStringToHue(name)
  const fill = `hsl(${hue} 70% 50% / 0.85)`
  const stroke = `hsl(${hue} 70% 35%)`
  // Deterministic 3x3 grid pattern
  const cells = Array.from({ length: 9 }).map((_, i) => ((hue + i * 37) % 100) > 50)
  return (
    <svg viewBox="0 0 24 24" className={cn("rounded-md", className)}>
      {cells.map((on, i) => {
        const x = 3 + (i % 3) * 6.5
        const y = 3 + Math.floor(i / 3) * 6.5
        return (
          <rect key={i} x={x} y={y} width="5.5" height="5.5" rx="1.2" fill={on ? fill : "none"} stroke={stroke} strokeWidth={on ? 0 : 1.2} />
        )
      })}
    </svg>
  )
}

export function BrandIcon({ id, name, className }: BrandIconProps) {
  const Component = BRAND_COMPONENTS[id]
  if (Component) {
    return <Component className={cn("size-6", className)} />
  }
  const slug = SLUG_MAP[id]
  if (slug) {
    return <ImgOrFallback slug={slug} name={name} className={className} />
  }
  return <AbstractGlyph name={name} className={cn("size-6", className)} />
}

function ImgOrFallback({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const [error, setError] = React.useState(false)
  if (error) {
    return <AbstractGlyph name={name} className={cn("size-6", className)} />
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={name}
      width={24}
      height={24}
      loading="lazy"
      className={cn("size-6", className)}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  )
}


