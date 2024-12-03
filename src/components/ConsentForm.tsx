"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const healthQuestions = [
  {
    id: 'hemophilia',
    question: 'Hemofilie (onemocnění krve)',
    requiresDetails: false
  },
  {
    id: 'hepatitis',
    question: 'Hepatitida A, B, C',
    requiresDetails: false
  },
  {
    id: 'hiv',
    question: 'HIV infekce',
    requiresDetails: false
  },
  {
    id: 'skinDiseases',
    question: 'Různé onemocnění kůže (Ekzém, Lupenka, Dermatitda, Seborea)',
    requiresDetails: true
  },
  {
    id: 'allergies',
    question: 'Alergie',
    requiresDetails: true
  },
  {
    id: 'keloid',
    question: 'Keloidní nebo Hypertrofická jizva',
    requiresDetails: false
  },
  {
    id: 'immuneDeficiency',
    question: 'Oslabení imunity (vrozené, potlačení imunitních reakcí - léky např. po transplantaci)',
    requiresDetails: true
  },
  {
    id: 'autoimmune',
    question: 'Autoimunitní onemocnění (např. štítná žláza, lymfedém)',
    requiresDetails: true
  },
  {
    id: 'bloodThinning',
    question: 'Léčba s efektem ředění krve',
    requiresDetails: false
  },
  {
    id: 'std',
    question: 'Pohlavní choroby',
    requiresDetails: false
  },
  {
    id: 'epilepsy',
    question: 'Epilepsie',
    requiresDetails: false
  },
  {
    id: 'diabetes',
    question: 'Diabetes',
    requiresDetails: false
  },
  {
    id: 'acuteIllness',
    question: 'Akutní onemocnění či nachlazení',
    requiresDetails: false
  },
  {
    id: 'fever',
    question: 'Horečka / Teplota',
    requiresDetails: false
  },
  {
    id: 'antibiotics',
    question: 'Užívání antibiotik',
    requiresDetails: false
  },
  {
    id: 'chronicDisease',
    question: 'Jiné chronické nebo akutní onemocnění',
    requiresDetails: true
  },
  {
    id: 'herpes',
    question: 'Herpes',
    requiresDetails: false
  },
  {
    id: 'pregnancy',
    question: '(u žen) Jste těhotná nebo kojíte?',
    requiresDetails: false
  },
  {
    id: 'oilySkin',
    question: 'Příliš mastná nebo kapilární pleť',
    requiresDetails: false
  },
  {
    id: 'mentalHealth',
    question: 'Psychické onemocnění, či celková psychická nepohoda či úzkost',
    requiresDetails: false
  },
  {
    id: 'previousPMU',
    question: 'Máte nyní nebo měla jste někdy v minulosti permanentní makeup na aplikované oblasti',
    requiresDetails: false
  }
];

const ConsentForm: React.FC = () => {
  const artists = [
    { id: '1', name: 'Veronika' },
    { id: '2', name: 'Michaela' },
    { id: '3', name: 'Monika' }
  ];

  const [formData, setFormData] = useState({
    artistName: '',
    clientName: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    pmuType: '',
    pigment: '',
    price: '',
    correctionPrice: '',
    photoConsent: true,
    date: ''
  });

  const [healthData, setHealthData] = useState<Record<string, any>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHealthChange = (id: string, value: string | boolean, isDetails = false) => {
    setHealthData(prev => ({
      ...prev,
      [isDetails ? `${id}Details` : id]: value
    }));
  };

  const generatePDF = async () => {
    const form = document.getElementById('consent-form');
    if (!form) return;

    const canvas = await html2canvas(form, {
      scale: 1,
      useCORS: true,
      logging: true, // Pro debug
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);

    return pdf;
  };

  const handleSubmit = async () => {
    try {
      if (!formData.clientName || !formData.birthDate) {
        alert('Prosím vyplňte všechny povinné údaje');
        return;
      }

      console.log('Začínám generovat PDF...'); // Debug log
      const pdf = await generatePDF();
      console.log('PDF vygenerováno:', pdf); // Debug log
      
      if (!pdf) {
        console.error('PDF se nepodařilo vygenerovat');
        return;
      }

      const fileName = `souhlas_${formData.clientName}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Ukládám soubor:', fileName); // Debug log
      pdf.save(fileName);
    } catch (error) {
      console.error('Chyba při generování PDF:', error);
      alert('Nastala chyba při generování PDF');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <Card id="consent-form">
        <CardHeader>
          <CardTitle className="text-center">
            INFORMOVANÝ SOUHLAS KLIENTA S PROVEDENÍM VÝKONU PMU
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-6">
            <p>Realizátor:</p>
            <p>La Majja PRO s.r.o.</p>
            <p>IČO 10960937</p>
            <p>se sídlem: U Mlýna 165, Poplze, 411 17 Libochovice</p>
          </div>

          <div className="space-y-4">
            {/* Výběr artisty */}
            <div className="space-y-2">
              <Label htmlFor="artistName">
                Jméno artisty realizujícího výkon PMU v rámci La Majja
              </Label>
              <Select
                value={formData.artistName}
                onValueChange={(value) => setFormData(prev => ({ ...prev, artistName: value }))}
              >
                <SelectTrigger id="artistName">
                  <SelectValue placeholder="Vyberte artistu" />
                </SelectTrigger>
                <SelectContent>
                  {artists.map((artist) => (
                    <SelectItem key={artist.id} value={artist.name}>
                      {artist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Základní údaje klienta */}
            <div className="space-y-2">
              <Label htmlFor="clientName">Jméno a příjmení</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Datum narození</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresa</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefonní číslo</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pmuType">Typ výkonu PMU</Label>
              <Input
                id="pmuType"
                name="pmuType"
                value={formData.pmuType}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pigment">Použitý pigment</Label>
              <Input
                id="pigment"
                name="pigment"
                value={formData.pigment}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Cena za výkon PMU</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correctionPrice">Cena za případnou korekci</Label>
              <Input
                id="correctionPrice"
                name="correctionPrice"
                type="number"
                value={formData.correctionPrice}
                onChange={handleInputChange}
              />
            </div>

            {/* Zdravotní dotazník */}
            <div className="space-y-6 border-t pt-6 mt-6">
              <h3 className="text-lg font-medium">Zdravotní dotazník</h3>
              {healthQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label className="flex-grow">{question.question}</Label>
                    <RadioGroup
                      value={healthData[question.id]?.toString()}
                      onValueChange={(value) => handleHealthChange(question.id, value === 'true')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`${question.id}-yes`} />
                        <Label htmlFor={`${question.id}-yes`}>ANO</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`${question.id}-no`} />
                        <Label htmlFor={`${question.id}-no`}>NE</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {question.requiresDetails && healthData[question.id] && (
                    <Input
                      value={healthData[`${question.id}Details`] || ''}
                      onChange={(e) => handleHealthChange(question.id, e.target.value, true)}
                      placeholder="Upřesněte prosím..."
                      className="mt-2"
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full mt-6"
            >
              Uložit souhlas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentForm;