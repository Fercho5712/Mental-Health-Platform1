import os
import sys
import json
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from textblob import TextBlob
import re
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

class MentalHealthAnalyzer:
    def __init__(self):
        self.mood_keywords = {
            'positive': ['feliz', 'alegre', 'contento', 'bien', 'genial', 'excelente', 'optimista', 'tranquilo', 'relajado'],
            'negative': ['triste', 'deprimido', 'ansiedad', 'preocupado', 'miedo', 'angustia', 'mal', 'terrible', 'desesperado'],
            'neutral': ['normal', 'regular', 'ok', 'igual', 'así', 'común']
        }
        
        self.crisis_indicators = [
            'suicidio', 'matarme', 'no quiero vivir', 'acabar con todo', 
            'lastimar', 'dolor insoportable', 'no puedo más', 'sin esperanza'
        ]
        
    def analyze_sentiment(self, text):
        """Analyze sentiment using TextBlob and custom keywords"""
        # TextBlob sentiment analysis
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        
        # Custom keyword analysis
        text_lower = text.lower()
        positive_count = sum(1 for word in self.mood_keywords['positive'] if word in text_lower)
        negative_count = sum(1 for word in self.mood_keywords['negative'] if word in text_lower)
        
        # Combine scores
        keyword_score = (positive_count - negative_count) / max(len(text.split()), 1)
        combined_score = (polarity + keyword_score) / 2
        
        return {
            'polarity': polarity,
            'keyword_score': keyword_score,
            'combined_score': combined_score,
            'sentiment': 'positive' if combined_score > 0.1 else 'negative' if combined_score < -0.1 else 'neutral'
        }
    
    def detect_crisis_indicators(self, text):
        """Detect potential crisis indicators in text"""
        text_lower = text.lower()
        indicators_found = [indicator for indicator in self.crisis_indicators if indicator in text_lower]
        return {
            'has_crisis_indicators': len(indicators_found) > 0,
            'indicators_found': indicators_found,
            'crisis_score': len(indicators_found) / len(self.crisis_indicators)
        }
    
    def analyze_conversation_patterns(self, messages):
        """Analyze patterns in conversation data"""
        if not messages:
            return {}
            
        df = pd.DataFrame(messages)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.day_name()
        
        # Analyze user messages only
        user_messages = df[df['sender'] == 'user']
        
        patterns = {
            'total_messages': len(user_messages),
            'avg_message_length': user_messages['content'].str.len().mean(),
            'most_active_hours': user_messages['hour'].value_counts().head(3).to_dict(),
            'most_active_days': user_messages['day_of_week'].value_counts().head(3).to_dict(),
            'conversation_frequency': self._calculate_frequency(user_messages['timestamp'])
        }
        
        return patterns
    
    def _calculate_frequency(self, timestamps):
        """Calculate conversation frequency patterns"""
        if len(timestamps) < 2:
            return {'avg_days_between': 0, 'frequency_pattern': 'insufficient_data'}
            
        timestamps_sorted = timestamps.sort_values()
        time_diffs = timestamps_sorted.diff().dropna()
        avg_days = time_diffs.dt.total_seconds().mean() / (24 * 3600)
        
        if avg_days < 1:
            pattern = 'daily'
        elif avg_days < 7:
            pattern = 'weekly'
        elif avg_days < 30:
            pattern = 'monthly'
        else:
            pattern = 'sporadic'
            
        return {
            'avg_days_between': avg_days,
            'frequency_pattern': pattern
        }
    
    def generate_mood_timeline(self, messages, user_id):
        """Generate mood timeline analysis"""
        user_messages = [msg for msg in messages if msg['sender'] == 'user']
        
        timeline_data = []
        for msg in user_messages:
            sentiment = self.analyze_sentiment(msg['content'])
            crisis = self.detect_crisis_indicators(msg['content'])
            
            timeline_data.append({
                'timestamp': msg['timestamp'],
                'sentiment_score': sentiment['combined_score'],
                'sentiment': sentiment['sentiment'],
                'crisis_score': crisis['crisis_score'],
                'message_length': len(msg['content']),
                'content_preview': msg['content'][:100] + '...' if len(msg['content']) > 100 else msg['content']
            })
        
        return timeline_data
    
    def generate_insights(self, analysis_data):
        """Generate actionable insights from analysis"""
        insights = []
        
        # Sentiment insights
        if 'mood_timeline' in analysis_data:
            timeline = analysis_data['mood_timeline']
            if timeline:
                recent_sentiments = [item['sentiment_score'] for item in timeline[-5:]]
                avg_recent_sentiment = np.mean(recent_sentiments)
                
                if avg_recent_sentiment < -0.3:
                    insights.append({
                        'type': 'warning',
                        'category': 'mood',
                        'message': 'Se detecta una tendencia negativa en el estado de ánimo reciente. Considera programar una sesión con tu terapeuta.',
                        'priority': 'high'
                    })
                elif avg_recent_sentiment > 0.3:
                    insights.append({
                        'type': 'positive',
                        'category': 'mood',
                        'message': 'Se observa una mejora en tu estado de ánimo. ¡Continúa con las estrategias que te están funcionando!',
                        'priority': 'medium'
                    })
        
        # Crisis indicators
        crisis_messages = [item for item in analysis_data.get('mood_timeline', []) if item['crisis_score'] > 0]
        if crisis_messages:
            insights.append({
                'type': 'alert',
                'category': 'crisis',
                'message': 'Se han detectado indicadores de crisis. Es importante que busques apoyo profesional inmediatamente.',
                'priority': 'critical'
            })
        
        # Activity patterns
        if 'conversation_patterns' in analysis_data:
            patterns = analysis_data['conversation_patterns']
            if patterns.get('conversation_frequency', {}).get('frequency_pattern') == 'sporadic':
                insights.append({
                    'type': 'suggestion',
                    'category': 'engagement',
                    'message': 'Considera mantener conversaciones más regulares para un mejor seguimiento de tu bienestar.',
                    'priority': 'low'
                })
        
        return insights
    
    def create_visualizations(self, analysis_data, output_dir='analysis_output'):
        """Create visualizations for the analysis"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Mood timeline plot
        if 'mood_timeline' in analysis_data and analysis_data['mood_timeline']:
            timeline = analysis_data['mood_timeline']
            df = pd.DataFrame(timeline)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            
            plt.figure(figsize=(12, 6))
            plt.plot(df['timestamp'], df['sentiment_score'], marker='o', linewidth=2, markersize=6)
            plt.axhline(y=0, color='gray', linestyle='--', alpha=0.7)
            plt.title('Evolución del Estado de Ánimo', fontsize=16, fontweight='bold')
            plt.xlabel('Fecha', fontsize=12)
            plt.ylabel('Puntuación de Sentimiento', fontsize=12)
            plt.grid(True, alpha=0.3)
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(f'{output_dir}/mood_timeline.png', dpi=300, bbox_inches='tight')
            plt.close()
            
            # Sentiment distribution
            plt.figure(figsize=(8, 6))
            sentiment_counts = df['sentiment'].value_counts()
            colors = {'positive': '#4CAF50', 'neutral': '#FFC107', 'negative': '#F44336'}
            plt.pie(sentiment_counts.values, labels=sentiment_counts.index, autopct='%1.1f%%',
                   colors=[colors.get(x, '#999999') for x in sentiment_counts.index])
            plt.title('Distribución de Sentimientos', fontsize=16, fontweight='bold')
            plt.savefig(f'{output_dir}/sentiment_distribution.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        # Activity patterns
        if 'conversation_patterns' in analysis_data:
            patterns = analysis_data['conversation_patterns']
            
            # Most active hours
            if 'most_active_hours' in patterns:
                plt.figure(figsize=(10, 6))
                hours = list(patterns['most_active_hours'].keys())
                counts = list(patterns['most_active_hours'].values())
                plt.bar(hours, counts, color='#2196F3', alpha=0.7)
                plt.title('Horas Más Activas de Conversación', fontsize=16, fontweight='bold')
                plt.xlabel('Hora del Día', fontsize=12)
                plt.ylabel('Número de Mensajes', fontsize=12)
                plt.grid(True, alpha=0.3)
                plt.tight_layout()
                plt.savefig(f'{output_dir}/active_hours.png', dpi=300, bbox_inches='tight')
                plt.close()
        
        print(f"Visualizaciones guardadas en: {output_dir}")
    
    def generate_report(self, user_id, messages, output_file='mental_health_report.json'):
        """Generate comprehensive analysis report"""
        print(f"Analizando datos para usuario {user_id}...")
        
        # Perform all analyses
        mood_timeline = self.generate_mood_timeline(messages, user_id)
        conversation_patterns = self.analyze_conversation_patterns(messages)
        
        analysis_data = {
            'user_id': user_id,
            'analysis_date': datetime.now().isoformat(),
            'mood_timeline': mood_timeline,
            'conversation_patterns': conversation_patterns,
            'summary_stats': self._calculate_summary_stats(mood_timeline, conversation_patterns)
        }
        
        # Generate insights
        insights = self.generate_insights(analysis_data)
        analysis_data['insights'] = insights
        
        # Create visualizations
        self.create_visualizations(analysis_data)
        
        # Save report
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2, default=str)
        
        print(f"Reporte generado: {output_file}")
        return analysis_data
    
    def _calculate_summary_stats(self, mood_timeline, conversation_patterns):
        """Calculate summary statistics"""
        if not mood_timeline:
            return {}
            
        sentiment_scores = [item['sentiment_score'] for item in mood_timeline]
        crisis_scores = [item['crisis_score'] for item in mood_timeline]
        
        return {
            'avg_sentiment': np.mean(sentiment_scores),
            'sentiment_std': np.std(sentiment_scores),
            'min_sentiment': np.min(sentiment_scores),
            'max_sentiment': np.max(sentiment_scores),
            'avg_crisis_score': np.mean(crisis_scores),
            'total_conversations': conversation_patterns.get('total_messages', 0),
            'avg_message_length': conversation_patterns.get('avg_message_length', 0)
        }

# Example usage and demo data
def run_analysis_demo():
    """Run analysis with demo data"""
    analyzer = MentalHealthAnalyzer()
    
    # Demo messages data
    demo_messages = [
        {
            'id': '1',
            'content': 'Hola Ana, me siento un poco triste hoy. He tenido un día difícil en el trabajo.',
            'sender': 'user',
            'timestamp': '2024-01-15T10:30:00Z'
        },
        {
            'id': '2',
            'content': 'Entiendo cómo te sientes. Es normal tener días difíciles. ¿Puedes contarme más?',
            'sender': 'ana',
            'timestamp': '2024-01-15T10:31:00Z'
        },
        {
            'id': '3',
            'content': 'Gracias por escuchar. Me siento mejor después de hablar contigo. Creo que necesitaba desahogarme.',
            'sender': 'user',
            'timestamp': '2024-01-15T10:35:00Z'
        },
        {
            'id': '4',
            'content': 'Hoy me siento mucho mejor. Dormí bien y tengo energía para enfrentar el día.',
            'sender': 'user',
            'timestamp': '2024-01-16T09:15:00Z'
        },
        {
            'id': '5',
            'content': 'Estoy preocupado por mi futuro. A veces siento que no puedo más con la ansiedad.',
            'sender': 'user',
            'timestamp': '2024-01-17T14:20:00Z'
        }
    ]
    
    # Run analysis
    report = analyzer.generate_report(user_id=1, messages=demo_messages)
    
    # Print summary
    print("\n=== RESUMEN DEL ANÁLISIS ===")
    print(f"Usuario ID: {report['user_id']}")
    print(f"Fecha de análisis: {report['analysis_date']}")
    print(f"Total de mensajes analizados: {len(report['mood_timeline'])}")
    
    if report['summary_stats']:
        stats = report['summary_stats']
        print(f"Sentimiento promedio: {stats['avg_sentiment']:.3f}")
        print(f"Puntuación de crisis promedio: {stats['avg_crisis_score']:.3f}")
    
    print(f"\nInsights generados: {len(report['insights'])}")
    for insight in report['insights']:
        print(f"- [{insight['priority'].upper()}] {insight['message']}")

if __name__ == "__main__":
    print("Iniciando análisis de salud mental...")
    run_analysis_demo()
    print("Análisis completado.")
