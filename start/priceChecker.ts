import PriceCheckerService from "App/Services/PriceCheckerService";
import { IocContract } from '@adonisjs/fold'
import Alert from 'App/Models/Alert'
import nodemailer from 'nodemailer'

async function fetchCurrentPrice(): Promise<number> {
  // Implement the logic to fetch the current price
  // and return the value as a number
}

async function sendEmailAlert(alert: Alert, currentPrice: number) {
  const transporter = nodemailer.createTransport({
    // Configure the email transporter
    // Use your email service credentials
  })

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: alert.email,
    subject: 'Price Alert',
    text: `The current price (${currentPrice}) is within the specified range for alert ${alert.id}.`,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Email alert sent for alert ${alert.id}`)
  } catch (error) {
    console.error(`Failed to send email alert for alert ${alert.id}: ${error.message}`)
  }
}

async function processAlerts(ioc: IocContract) {
  const alerts = await Alert.query().where('actif', true)
  const currentPrice = await fetchCurrentPrice()

  for (const alert of alerts) {
    if (currentPrice >= alert.min && currentPrice <= alert.max) {
      await sendEmailAlert(alert, currentPrice)
    }
  }

  ioc.logger.info('Price alerts processed')
}

export default async function startPriceAlertChecker(ioc: IocContract) {
  // Add any necessary initialization code

  setInterval(() => {
    processAlerts(ioc)
  }, 60000) // Check alerts every 1 minute
}
