import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import json
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from scipy import stats
import warnings
from collections import defaultdict
from typing import Dict, List, Any, Tuple
import statistics

warnings.filterwarnings('ignore')

class MoodPatternAnalyzer:
    def __init__(self):
        self.mood_categories = {
            'very_positive': (0.5, 1.0),
            'positive': (0.1, 0.5),
            'neutral': (-0.1, 0.1),
            'negative': (-0.5, -0.1),
            'very_negative': (-1.0, -0.5)
        }
        
        self.mood_indicators = {
            'depression': ['triste', 'deprimido', 'vacío', 'sin esperanza', 'desesperanzado', 'melancólico'],
            'anxiety': ['ansioso', 'nervioso', 'preocupado', 'estresado', 'agobiado', 'inquieto'],
            'anger': ['enojado', 'furioso', 'irritado', 'molesto', 'frustrado', 'rabioso'],
            'joy': ['feliz', 'alegre', 'contento', 'eufórico', 'animado', 'optimista'],
            'fear': ['miedo', 'asustado', 'aterrado', 'pánico', 'temor', 'espanto'],
            'calm': ['tranquilo', 'relajado', 'sereno', 'pacífico', 'calmado', 'sosegado']
        }
    
    def load_user_data(self, user_id, days_back=30):
        """Load user data for analysis (mock implementation)"""
        # In real implementation, this would connect to MongoDB
        # For now, we'll generate sample data
        return self._generate_sample_data(user_id, days_back)
    
    def _generate_sample_data(self, user_id, days_back):
        """Generate sample mood data for demonstration"""
        np.random.seed(user_id)  # For reproducible results
        
        dates = pd.date_range(
            start=datetime.now() - timedelta(days=days_back),
            end=datetime.now(),
            freq='D'
        )
        
        # Generate mood patterns with some trends
        base_mood = np.random.normal(0, 0.3, len(dates))
        
        # Add weekly patterns (weekends might be different)
        weekly_pattern = np.sin(np.arange(len(dates)) * 2 * np.pi / 7) * 0.2
        
        # Add some trend (gradual improvement or decline)
        trend = np.linspace(-0.1, 0.1, len(dates))
        
        mood_scores = base_mood + weekly_pattern + trend
        mood_scores = np.clip(mood_scores, -1, 1)  # Keep within bounds
        
        data = []
        for i, date in enumerate(dates):
            # Simulate multiple entries per day sometimes
            entries_today = np.random.poisson(1.5)  # Average 1.5 entries per day
            
            for _ in range(max(1, entries_today)):
                data.append({
                    'date': date,
                    'mood_score': mood_scores[i] + np.random.normal(0, 0.1),
                    'anxiety_level': max(0, min(10, np.random.normal(5, 2))),
                    'sleep_quality': max(1, min(10, np.random.normal(7, 1.5))),
                    'energy_level': max(1, min(10, np.random.normal(6, 2))),
                    'social_interaction': np.random.choice([0, 1], p=[0.3, 0.7]),
                    'exercise': np.random.choice([0, 1], p=[0.6, 0.4]),
                    'medication_taken': np.random.choice([0, 1], p=[0.2, 0.8])
                })
        
        return pd.DataFrame(data)
    
    def analyze_mood_trends(self, df):
        """Analyze mood trends over time"""
        daily_mood = df.groupby(df['date'].dt.date)['mood_score'].mean()
        
        # Calculate trend using linear regression
        x = np.arange(len(daily_mood))
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, daily_mood.values)
        
        # Identify mood categories distribution
        mood_distribution = {}
        for category, (min_val, max_val) in self.mood_categories.items():
            count = ((daily_mood >= min_val) & (daily_mood < max_val)).sum()
            mood_distribution[category] = count
        
        return {
            'trend_slope': slope,
            'trend_r_squared': r_value**2,
            'trend_p_value': p_value,
            'average_mood': daily_mood.mean(),
            'mood_std': daily_mood.std(),
            'mood_distribution': mood_distribution,
            'best_day': daily_mood.idxmax(),
            'worst_day': daily_mood.idxmin(),
            'daily_mood_series': daily_mood
        }
    
    def analyze_correlations(self, df):
        """Analyze correlations between mood and other factors"""
        correlation_vars = ['mood_score', 'anxiety_level', 'sleep_quality', 
                          'energy_level', 'social_interaction', 'exercise', 'medication_taken']
        
        corr_matrix = df[correlation_vars].corr()
        mood_correlations = corr_matrix['mood_score'].drop('mood_score').sort_values(key=abs, ascending=False)
        
        return {
            'correlation_matrix': corr_matrix,
            'mood_correlations': mood_correlations,
            'strongest_positive_factor': mood_correlations.idxmax(),
            'strongest_negative_factor': mood_correlations.idxmin()
        }
    
    def identify_mood_patterns(self, df):
        """Identify patterns in mood data using clustering"""
        # Prepare features for clustering
        features = ['mood_score', 'anxiety_level', 'sleep_quality', 'energy_level']
        X = df[features].values
        
        # Standardize features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Perform clustering
        kmeans = KMeans(n_clusters=3, random_state=42)
        clusters = kmeans.fit_predict(X_scaled)
        
        # Analyze clusters
        df_clustered = df.copy()
        df_clustered['cluster'] = clusters
        
        cluster_analysis = {}
        for cluster_id in range(3):
            cluster_data = df_clustered[df_clustered['cluster'] == cluster_id]
            cluster_analysis[f'cluster_{cluster_id}'] = {
                'size': len(cluster_data),
                'avg_mood': cluster_data['mood_score'].mean(),
                'avg_anxiety': cluster_data['anxiety_level'].mean(),
                'avg_sleep': cluster_data['sleep_quality'].mean(),
                'avg_energy': cluster_data['energy_level'].mean(),
                'description': self._describe_cluster(cluster_data)
            }
        
        return {
            'clusters': cluster_analysis,
            'cluster_labels': clusters
        }
    
    def _describe_cluster(self, cluster_data):
        """Generate description for a cluster"""
        avg_mood = cluster_data['mood_score'].mean()
        avg_anxiety = cluster_data['anxiety_level'].mean()
        avg_sleep = cluster_data['sleep_quality'].mean()
        
        if avg_mood > 0.2:
            mood_desc = "estado de ánimo positivo"
        elif avg_mood < -0.2:
            mood_desc = "estado de ánimo bajo"
        else:
            mood_desc = "estado de ánimo neutral"
        
        if avg_anxiety > 7:
            anxiety_desc = "alta ansiedad"
        elif avg_anxiety < 4:
            anxiety_desc = "baja ansiedad"
        else:
            anxiety_desc = "ansiedad moderada"
        
        if avg_sleep > 7:
            sleep_desc = "buen sueño"
        elif avg_sleep < 5:
            sleep_desc = "sueño deficiente"
        else:
            sleep_desc = "sueño regular"
        
        return f"Patrón caracterizado por {mood_desc}, {anxiety_desc} y {sleep_desc}"
    
    def generate_recommendations(self, analysis_results):
        """Generate personalized recommendations based on analysis"""
        recommendations = []
        
        # Trend-based recommendations
        if analysis_results['trends']['trend_slope'] < -0.01:
            recommendations.append({
                'category': 'trend',
                'priority': 'high',
                'recommendation': 'Se detecta una tendencia descendente en tu estado de ánimo. Considera programar una cita con tu terapeuta.',
                'action': 'schedule_appointment'
            })
        elif analysis_results['trends']['trend_slope'] > 0.01:
            recommendations.append({
                'category': 'trend',
                'priority': 'medium',
                'recommendation': 'Tu estado de ánimo muestra una tendencia positiva. ¡Continúa con las estrategias que te están funcionando!',
                'action': 'maintain_current_strategies'
            })
        
        # Correlation-based recommendations
        correlations = analysis_results['correlations']['mood_correlations']
        
        if 'sleep_quality' in correlations.index and correlations['sleep_quality'] > 0.3:
            recommendations.append({
                'category': 'sleep',
                'priority': 'medium',
                'recommendation': 'La calidad del sueño tiene un impacto positivo en tu estado de ánimo. Mantén una rutina de sueño consistente.',
                'action': 'improve_sleep_hygiene'
            })
        
        if 'exercise' in correlations.index and correlations['exercise'] > 0.2:
            recommendations.append({
                'category': 'exercise',
                'priority': 'medium',
                'recommendation': 'El ejercicio parece beneficiar tu estado de ánimo. Intenta mantener actividad física regular.',
                'action': 'increase_physical_activity'
            })
        
        if 'anxiety_level' in correlations.index and correlations['anxiety_level'] < -0.3:
            recommendations.append({
                'category': 'anxiety',
                'priority': 'high',
                'recommendation': 'Los niveles altos de ansiedad están afectando tu estado de ánimo. Practica técnicas de relajación.',
                'action': 'practice_relaxation_techniques'
            })
        
        return recommendations
    
    def create_visualizations(self, df, analysis_results, output_dir='mood_analysis'):
        """Create comprehensive visualizations"""
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        # Set style
        plt.style.use('seaborn-v0_8')
        
        # 1. Mood timeline
        plt.figure(figsize=(14, 6))
        daily_mood = analysis_results['trends']['daily_mood_series']
        plt.plot(daily_mood.index, daily_mood.values, marker='o', linewidth=2, markersize=4)
        
        # Add trend line
        x = np.arange(len(daily_mood))
        slope = analysis_results['trends']['trend_slope']
        intercept = daily_mood.iloc[0] - slope * 0
        trend_line = slope * x + intercept
        plt.plot(daily_mood.index, trend_line, '--', color='red', alpha=0.7, label=f'Tendencia (pendiente: {slope:.4f})')
        
        plt.title('Evolución del Estado de Ánimo', fontsize=16, fontweight='bold')
        plt.xlabel('Fecha')
        plt.ylabel('Puntuación de Estado de Ánimo')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f'{output_dir}/mood_timeline.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        # 2. Correlation heatmap
        plt.figure(figsize=(10, 8))
        corr_matrix = analysis_results['correlations']['correlation_matrix']
        mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
        sns.heatmap(corr_matrix, mask=mask, annot=True, cmap='RdBu_r', center=0,
                   square=True, linewidths=0.5, cbar_kws={"shrink": .8})
        plt.title('Matriz de Correlaciones', fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/correlation_heatmap.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        # 3. Mood distribution
        plt.figure(figsize=(10, 6))
        mood_dist = analysis_results['trends']['mood_distribution']
        colors = ['#d32f2f', '#f57c00', '#fbc02d', '#689f38', '#388e3c']
        plt.bar(mood_dist.keys(), mood_dist.values(), color=colors, alpha=0.8)
        plt.title('Distribución de Estados de Ánimo', fontsize=16, fontweight='bold')
        plt.xlabel('Categoría de Estado de Ánimo')
        plt.ylabel('Número de Días')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f'{output_dir}/mood_distribution.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        # 4. Weekly pattern
        df['day_of_week'] = df['date'].dt.day_name()
        weekly_mood = df.groupby('day_of_week')['mood_score'].mean()
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        weekly_mood = weekly_mood.reindex(day_order)
        
        plt.figure(figsize=(10, 6))
        plt.bar(range(len(weekly_mood)), weekly_mood.values, color='#2196f3', alpha=0.8)
        plt.title('Patrón Semanal del Estado de Ánimo', fontsize=16, fontweight='bold')
        plt.xlabel('Día de la Semana')
        plt.ylabel('Estado de Ánimo Promedio')
        plt.xticks(range(len(weekly_mood)), [day[:3] for day in weekly_mood.index])
        plt.axhline(y=0, color='gray', linestyle='--', alpha=0.7)
        plt.tight_layout()
        plt.savefig(f'{output_dir}/weekly_pattern.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Visualizaciones guardadas en: {output_dir}")
    
    def generate_comprehensive_report(self, user_id, days_back=30):
        """Generate comprehensive mood pattern analysis report"""
        print(f"Generando análisis de patrones de estado de ánimo para usuario {user_id}...")
        
        # Load data
        df = self.load_user_data(user_id, days_back)
        
        # Perform analyses
        trend_analysis = self.analyze_mood_trends(df)
        correlation_analysis = self.analyze_correlations(df)
        pattern_analysis = self.identify_mood_patterns(df)
        
        # Combine results
        analysis_results = {
            'user_id': user_id,
            'analysis_period': f'{days_back} days',
            'analysis_date': datetime.now().isoformat(),
            'data_points': len(df),
            'trends': trend_analysis,
            'correlations': correlation_analysis,
            'patterns': pattern_analysis
        }
        
        # Generate recommendations
        recommendations = self.generate_recommendations(analysis_results)
        analysis_results['recommendations'] = recommendations
        
        # Create visualizations
        self.create_visualizations(df, analysis_results)
        
        # Save report
        output_file = f'mood_analysis_user_{user_id}.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_results, f, ensure_ascii=False, indent=2, default=str)
        
        # Print summary
        self._print_summary(analysis_results)
        
        return analysis_results
    
    def _print_summary(self, results):
        """Print analysis summary"""
        print("\n" + "="*50)
        print("RESUMEN DEL ANÁLISIS DE PATRONES DE ESTADO DE ÁNIMO")
        print("="*50)
        
        print(f"Usuario: {results['user_id']}")
        print(f"Período: {results['analysis_period']}")
        print(f"Puntos de datos: {results['data_points']}")
        
        trends = results['trends']
        print(f"\nEstado de ánimo promedio: {trends['average_mood']:.3f}")
        print(f"Tendencia: {'Mejorando' if trends['trend_slope'] > 0 else 'Empeorando' if trends['trend_slope'] < 0 else 'Estable'}")
        print(f"R² de tendencia: {trends['trend_r_squared']:.3f}")
        
        correlations = results['correlations']['mood_correlations']
        print(f"\nFactor más positivo: {correlations.idxmax()} ({correlations.max():.3f})")
        print(f"Factor más negativo: {correlations.idxmin()} ({correlations.min():.3f})")
        
        print(f"\nRecomendaciones generadas: {len(results['recommendations'])}")
        for rec in results['recommendations']:
            print(f"- [{rec['priority'].upper()}] {rec['recommendation']}")
    
    def analyze_mood_patterns_from_chat(self, chat_data: List[Dict]) -> Dict[str, Any]:
        """Analyze mood patterns from chat data over time."""
        
        # Initialize tracking structures
        daily_moods = defaultdict(lambda: defaultdict(int))
        hourly_moods = defaultdict(lambda: defaultdict(int))
        mood_transitions = defaultdict(lambda: defaultdict(int))
        mood_timeline = []
        
        previous_dominant_mood = None
        
        for message in chat_data:
            if message.get('sender') != 'user':
                continue
                
            try:
                timestamp = datetime.fromisoformat(message.get('timestamp', '').replace('Z', '+00:00'))
                content = message.get('message', '').lower()
                
                # Count mood indicators in message
                mood_scores = {}
                for mood, keywords in self.mood_indicators.items():
                    score = sum(1 for keyword in keywords if keyword in content)
                    mood_scores[mood] = score
                
                # Determine dominant mood
                dominant_mood = max(mood_scores.items(), key=lambda x: x[1])
                if dominant_mood[1] > 0:  # Only if there are mood indicators
                    mood_name = dominant_mood[0]
                    
                    # Track daily patterns
                    day_key = timestamp.strftime('%Y-%m-%d')
                    daily_moods[day_key][mood_name] += 1
                    
                    # Track hourly patterns
                    hour_key = timestamp.hour
                    hourly_moods[hour_key][mood_name] += 1
                    
                    # Track mood transitions
                    if previous_dominant_mood and previous_dominant_mood != mood_name:
                        mood_transitions[previous_dominant_mood][mood_name] += 1
                    
                    # Add to timeline
                    mood_timeline.append({
                        'timestamp': timestamp.isoformat(),
                        'mood': mood_name,
                        'intensity': dominant_mood[1],
                        'all_scores': mood_scores
                    })
                    
                    previous_dominant_mood = mood_name
                    
            except Exception as e:
                print(f"Error processing message: {e}")
                continue
        
        # Calculate patterns and insights
        analysis_results = {
            'mood_distribution': self.calculate_mood_distribution(mood_timeline),
            'daily_patterns': dict(daily_moods),
            'hourly_patterns': dict(hourly_moods),
            'mood_transitions': dict(mood_transitions),
            'mood_timeline': mood_timeline,
            'insights': self.generate_mood_insights(daily_moods, hourly_moods, mood_timeline),
            'analysis_timestamp': datetime.now().isoformat()
        }
        
        return analysis_results
    
    def calculate_mood_distribution(self, mood_timeline: List[Dict]) -> Dict[str, Any]:
        """Calculate overall mood distribution and statistics."""
        if not mood_timeline:
            return {}
        
        mood_counts = defaultdict(int)
        mood_intensities = defaultdict(list)
        
        for entry in mood_timeline:
            mood = entry['mood']
            intensity = entry['intensity']
            
            mood_counts[mood] += 1
            mood_intensities[mood].append(intensity)
        
        total_entries = len(mood_timeline)
        
        distribution = {}
        for mood, count in mood_counts.items():
            distribution[mood] = {
                'count': count,
                'percentage': (count / total_entries) * 100,
                'average_intensity': statistics.mean(mood_intensities[mood]),
                'max_intensity': max(mood_intensities[mood]),
                'min_intensity': min(mood_intensities[mood])
            }
        
        return distribution
    
    def generate_mood_insights(self, daily_moods, hourly_moods, mood_timeline) -> List[str]:
        """Generate insights based on mood patterns."""
        insights = []
        
        # Most common mood
        if mood_timeline:
            mood_counts = defaultdict(int)
            for entry in mood_timeline:
                mood_counts[entry['mood']] += 1
            
            most_common_mood = max(mood_counts.items(), key=lambda x: x[1])
            insights.append(f"El estado de ánimo más frecuente es '{most_common_mood[0]}' ({most_common_mood[1]} veces)")
        
        # Time-based patterns
        if hourly_moods:
            # Find most problematic hours
            negative_moods = ['depression', 'anxiety', 'anger', 'fear']
            hourly_negative = defaultdict(int)
            
            for hour, moods in hourly_moods.items():
                for mood, count in moods.items():
                    if mood in negative_moods:
                        hourly_negative[hour] += count
            
            if hourly_negative:
                worst_hour = max(hourly_negative.items(), key=lambda x: x[1])
                insights.append(f"La hora con más estados negativos es las {worst_hour[0]}:00 horas")
        
        # Weekly patterns
        if daily_moods:
            if len(daily_moods) >= 7:
                insights.append(f"Se han registrado patrones de humor durante {len(daily_moods)} días")
            
            # Find days with most negative moods
            daily_negative = {}
            negative_moods = ['depression', 'anxiety', 'anger', 'fear']
            
            for day, moods in daily_moods.items():
                negative_count = sum(count for mood, count in moods.items() if mood in negative_moods)
                if negative_count > 0:
                    daily_negative[day] = negative_count
            
            if daily_negative:
                worst_day = max(daily_negative.items(), key=lambda x: x[1])
                insights.append(f"El día con más estados negativos fue {worst_day[0]}")
        
        # Mood stability
        if len(mood_timeline) >= 5:
            recent_moods = [entry['mood'] for entry in mood_timeline[-5:]]
            unique_recent_moods = len(set(recent_moods))
            
            if unique_recent_moods == 1:
                insights.append("El estado de ánimo ha sido estable recientemente")
            elif unique_recent_moods >= 4:
                insights.append("El estado de ánimo ha sido muy variable recientemente")
        
        return insights
    
    def create_mood_visualization(self, analysis_results: Dict[str, Any]) -> None:
        """Create visualizations for mood patterns."""
        try:
            # Mood distribution pie chart
            if analysis_results.get('mood_distribution'):
                moods = list(analysis_results['mood_distribution'].keys())
                percentages = [data['percentage'] for data in analysis_results['mood_distribution'].values()]
                
                plt.figure(figsize=(10, 6))
                plt.subplot(1, 2, 1)
                plt.pie(percentages, labels=moods, autopct='%1.1f%%')
                plt.title('Distribución de Estados de Ánimo')
                
                # Hourly pattern bar chart
                if analysis_results.get('hourly_patterns'):
                    hours = list(range(24))
                    mood_totals = []
                    
                    for hour in hours:
                        total = sum(analysis_results['hourly_patterns'].get(hour, {}).values())
                        mood_totals.append(total)
                    
                    plt.subplot(1, 2, 2)
                    plt.bar(hours, mood_totals)
                    plt.title('Actividad Emocional por Hora')
                    plt.xlabel('Hora del Día')
                    plt.ylabel('Número de Registros')
                    
                plt.tight_layout()
                plt.savefig('mood_analysis.png', dpi=300, bbox_inches='tight')
                print("📊 Gráfico guardado como 'mood_analysis.png'")
                
        except ImportError:
            print("⚠️ Matplotlib no disponible. Saltando visualizaciones.")
        except Exception as e:
            print(f"⚠️ Error creando visualizaciones: {e}")

# Demo execution
if __name__ == "__main__":
    analyzer = MoodPatternAnalyzer()
    
    # Run analysis for demo user
    report = analyzer.generate_comprehensive_report(user_id=1, days_back=30)
    
    print("\nAnálisis completado. Revisa los archivos generados para más detalles.")
