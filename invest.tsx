'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle, XCircle, Clock, Mail, DollarSign, Trash2, Copyright, ExternalLink } from "lucide-react"
import { format } from 'date-fns'

type InvestmentRequest = {
  id: number
  productName: string
  description: string
  amount: number
  email: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp: string
}

const ADMIN_IP = '68.35.60.60'

export default function DevInvest() {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [email, setEmail] = useState('')
  const [requests, setRequests] = useState<InvestmentRequest[]>([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userIP, setUserIP] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showThankYou, setShowThankYou] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    setUserIP(Math.random() < 0.5 ? ADMIN_IP : '127.0.0.1')

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const savedRequests = localStorage.getItem('investmentRequests')
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests))
    }

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('investmentRequests', JSON.stringify(requests))
  }, [requests])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!productName || !description || !amount || !email) {
      setError('Please fill in all fields')
      setIsSubmitting(false)
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    const newRequest: InvestmentRequest = {
      id: Date.now(),
      productName,
      description,
      amount: parseFloat(amount),
      email,
      status: 'pending',
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

    setRequests(prevRequests => [newRequest, ...prevRequests])
    setProductName('')
    setDescription('')
    setAmount('')
    setEmail('')
    setIsSubmitting(false)
    setShowThankYou(true)
    setTimeout(() => setShowThankYou(false), 3000)
  }

  const handleStatusChange = (id: number, newStatus: 'approved' | 'rejected') => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    )
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all saved data?')) {
      localStorage.removeItem('investmentRequests')
      setRequests([])
    }
  }

  const renderModalContent = () => {
    switch (activeModal) {
      case 'About':
        return (
          <div className="space-y-4">
            <p>Dev.Invest is a platform that connects innovative developers with potential investors. Our mission is to foster growth in the tech industry by providing a streamlined process for securing investments in promising projects.</p>
            <p>Founded in 2024, we've already helped numerous startups and individual developers turn their ideas into reality.</p>
          </div>
        )
      case 'Privacy':
        return (
          <div className="space-y-4">
            <p>At Dev.Invest, we take your privacy seriously. We collect only the information necessary to facilitate the investment process and improve our services.</p>
            <p>We never sell your personal data to third parties. Your information is securely stored and only accessed by authorized personnel when necessary.</p>
            <p>For more details, please review our full privacy policy.</p>
          </div>
        )
      case 'Terms':
        return (
          <div className="space-y-4">
            <p>By using Dev.Invest, you agree to our terms of service. These terms outline the rules and regulations for the use of our platform.</p>
            <p>Key points include:</p>
            <ul className="list-disc pl-5">
              <li>All submitted projects must be original</li>
              <li>Dev.Invest is not responsible for any financial losses</li>
              <li>Users agree to our dispute resolution process</li>
            </ul>
            <p>Please read our full terms of service for comprehensive information.</p>
          </div>
        )
      case 'Contact':
        return (
          <div className="space-y-4">
            <p>We're always here to help! If you have any questions, concerns, or feedback, please don't hesitate to reach out to us.</p>
            <p>Email: <a href="mailto:me@devycreates.com" className="text-blue-500 hover:underline">me@devycreates.com</a></p>
            <p>For urgent matters, you can reach our support team during business hours at:</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Tech Street, Innovation City, TC 12345</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <motion.div 
        className="absolute inset-0 opacity-50"
        animate={{
          backgroundImage: [
            'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
            'radial-gradient(circle, rgba(255,255,255,0.1) 100%, transparent 60%)'
          ]
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
      />
      <div className="container mx-auto max-w-4xl relative">
        <motion.div 
          className="flex items-center justify-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-full p-3 shadow-lg mr-4">
            <DollarSign className="h-10 w-10 text-purple-500" />
          </div>
          <h1 className="text-5xl font-bold text-white">Dev.Invest</h1>
        </motion.div>
        
        <Card className="mb-8 shadow-lg backdrop-blur-md bg-white/80 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Submit Investment Request</span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Badge variant="outline" className="text-sm">
                  <Clock className="mr-1 h-4 w-4" />
                  {format(currentTime, 'MMMM do, yyyy HH:mm:ss')}
                </Badge>
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product"
                  rows={3}
                  className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">
                  Investment Amount ($)
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button 
                type="submit" 
                className="w-full transition-all duration-300 hover:bg-purple-600 hover:scale-105" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showThankYou && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg"
            >
              Thank you for your submission!
            </motion.div>
          )}
        </AnimatePresence>

        {userIP === ADMIN_IP && (
          <Card className="shadow-lg backdrop-blur-md bg-white/80 overflow-hidden mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Investment Requests</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearData}
                className="flex items-center transition-all duration-300 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Data
              </Button>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {requests.length === 0 ? (
                  <p className="text-muted-foreground text-center">No investment requests yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {requests.map((request) => (
                      <motion.li
                        key={request.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{request.productName}</h3>
                          <Badge
                            variant={
                              request.status === 'approved' ? 'success' :
                              request.status === 'rejected' ? 'destructive' : 'default'
                            }
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                        <p className="text-sm font-medium mb-2">
                          Requested Investment: ${request.amount.toFixed(2)}
                        </p>
                        <p className="text-sm mb-2">
                          <Mail className="inline mr-1 h-4 w-4" />
                          {request.email}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Submitted at: {request.timestamp}
                        </p>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center transition-all duration-300 hover:bg-green-500 hover:text-white"
                              onClick={() => handleStatusChange(request.id, 'approved')}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center transition-all duration-300 hover:bg-red-500 hover:text-white"
                              onClick={() => handleStatusChange(request.id, 'rejected')}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}
      </div>
      <footer className="mt-8 text-center text-white bg-black/30 py-6 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center mb-4">
            <Copyright className="h-5 w-5 mr-2" />
            <p className="text-sm">{new Date().getFullYear()} Dev.Invest. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center space-x-4">
            {['About', 'Privacy', 'Terms', 'Contact'].map((item) => (
              <Dialog key={item}>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="text-white hover:text-purple-200 transition-colors duration-300"
                    onClick={() => setActiveModal(item)}
                  >
                    {item}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{item}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {renderModalContent()}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          <div className="mt-4">
            <a
              href="https://github.com/yourusername/dev-invest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-white hover:text-purple-200 transition-colors duration-300"
            >
              View on GitHub
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
